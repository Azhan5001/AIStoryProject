"""
Story generation orchestration module.

This module coordinates the multi-agent story generation process:
- initialize_story(): Scene preparation and first message
- advance_story(): Ongoing story progression with user co-creation

Utility functions (parsing, formatting, export) are in src/utils/.

Main Functions:
	initialize_story(avatar, story_setting) -> List[StoryMessage]
		Orchestrates initial scene construction and first story message.
	
	advance_story(avatar, story_setting, current_direction, history, user_input) 
		-> Tuple[List[StoryMessage], str]
		Advances the story with optional user guidance.
	
	non_multiagent_generate(avatar, story_setting, history, user_input, system_directives)
		-> StoryMessage
		Baseline generation without multi-agent orchestration.

Internal Functions (prefixed with _):
	_analyze_user_intent, _recalibrate_narrative, _generate_story_section,
	_evaluate_story, _generate_with_evaluation, _select_location,
	_select_initial_direction, _select_props, _create_npcs
"""

from __future__ import annotations
import os
import json
import time
import random
from pathlib import Path
from typing import List, Optional, Tuple

from schemas.story_generation import (
	StoryAvatar, 
	StoryMessage, 
	StoryEvaluation, 
	StoryContext, 
	MissingElementsInfo,
)
from schemas.message import Role

# Import utilities from utils package
from utils import (
	# Parsing
	parse_reasoning,
	parse_user_intent,
	parse_selected_location,
	parse_selected_props,
	parse_selected_characters,
	parse_selected_direction,
	parse_elements_evaluation,
	parse_quality_evaluation,
	# Formatting
	format_history,
)

# Import agents
from agent.agents import (
	user_intent_analysis_agent,
	story_generation_agent,
	story_recalibration_analysis_agent,
	story_recalibration_selection_agent,
	story_elements_evaluation_agent,
	story_self_evaluation_agent,
	narrative_direction_agent,
	scene_prop_selection_agent,
	location_selection_agent,
	npc_creation_agent,
)

MAX_REGENERATION_ATTEMPTS = int(os.getenv('MAX_REGENERATION_ATTEMPTS', '2'))
MOCK_MODE = os.getenv('MOCK_MODE', 'false').lower() == 'true'

_mock_model = None

def _get_mock_model():
	global _mock_model
	if _mock_model is None:
		import markovify
		corpus_path = Path(__file__).parent / 'data' / 'bee_movie.txt'
		with open(corpus_path, 'r') as f:
			text = f.read()
		_mock_model = markovify.NewlineText(text)
	return _mock_model


def _generate_mock_paragraph(sentence_count: int = 5) -> str:
	model = _get_mock_model()
	sentences = []
	attempts = 0
	while len(sentences) < sentence_count and attempts < sentence_count * 10:
		sentence = model.make_sentence()
		if sentence:
			sentences.append(sentence)
		attempts += 1
	return ' '.join(sentences) if sentences else 'According to all known laws of aviation, there is no way a bee should be able to fly.'


def _mock_initialize_story(
	avatar: StoryAvatar,
	story_setting: str,
) -> List[StoryMessage]:
	time.sleep(random.uniform(1.0, 2.0))

	return [
		StoryMessage(
			content=_generate_mock_paragraph(5),
			narrative_direction=_generate_mock_paragraph(1),
			role=Role.assistant,
		),
	]


def _mock_advance_story(
	avatar: StoryAvatar,
	story_setting: str,
	current_direction: str,
	history: List[StoryMessage],
	user_input: Optional[str] = None,
) -> Tuple[List[StoryMessage], str]:
	time.sleep(random.uniform(1.0, 2.0))
	new_direction = _generate_mock_paragraph(1)

	message = StoryMessage(
		content=_generate_mock_paragraph(5),
		narrative_direction=new_direction,
		role=Role.assistant,
	)
	return [message], new_direction

def _get_all_agents_usage() -> dict:
    """Collect cumulative token usage from all agents."""
    agents = [
        ("user_intent_analysis", user_intent_analysis_agent),
        ("story_recalibration_analysis", story_recalibration_analysis_agent),
        ("story_recalibration_selection", story_recalibration_selection_agent),
        ("story_generation", story_generation_agent),
        ("story_elements_evaluation", story_elements_evaluation_agent),
        ("story_self_evaluation", story_self_evaluation_agent),
        ("narrative_direction", narrative_direction_agent),
        ("scene_prop_selection", scene_prop_selection_agent),
        ("location_selection", location_selection_agent),
        ("npc_creation", npc_creation_agent),
    ]
    
    per_agent = {}
    grand_total = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
    
    for name, agent in agents:
        usage = agent.llm_client.total_usage
        if usage["total_tokens"] > 0:
            per_agent[name] = {**usage}
            grand_total["prompt_tokens"] += usage["prompt_tokens"]
            grand_total["completion_tokens"] += usage["completion_tokens"]
            grand_total["total_tokens"] += usage["total_tokens"]
    
    return {"per_agent": per_agent, "grand_total": grand_total}

def _reset_all_agents_usage():
    """Reset token counters for all agents."""
    for agent in [
        user_intent_analysis_agent, story_recalibration_analysis_agent,
        story_recalibration_selection_agent, story_generation_agent,
        story_elements_evaluation_agent, story_self_evaluation_agent,
        narrative_direction_agent, scene_prop_selection_agent,
        location_selection_agent, npc_creation_agent,
    ]:
        agent.llm_client.reset_usage()


# AGENT HELPER FUNCTIONS

def _analyze_user_intent(context: StoryContext) -> str:
	"""Analyze user input to understand intent for story modifications.
	
	Calls user_intent_analysis_agent to determine what the user wants
	to add, modify, or change in the story.

	Args:
		context: StoryContext containing user_input and history.
			If user_input is empty/None, returns empty string immediately.

	Returns:
		Raw analysis text from the agent, or empty string if no user input.
	
	Note:
		The returned text should be parsed with parse_user_intent() to
		extract structured summary and elements list.
	"""
	if not context.user_input:
		return ''
	
	payload = {
		'user_input': context.user_input,
		'current_story': format_history(context.history),
	}
	
	result = user_intent_analysis_agent.generate(payload)
	return result['text']


def _recalibrate_narrative(context: StoryContext) -> str:
	"""Determine if narrative direction needs adjustment.

	Calls story_recalibration_analysis_agent to propose candidate directions,
	then story_recalibration_selection_agent to select the best one.

	Args:
		context: StoryContext with current narrative_direction and analysis.

	Returns:
		New or unchanged narrative direction string.
	"""
	# Prepare payload for analysis agent
	analysis_payload = {
		'avatar': f'{context.avatar.name}: {context.avatar.description or "No description"}',
		'story_setting': context.story_setting,
		'current_direction': context.narrative_direction,
		'user_intent_analysis': context.user_intent_analysis or '',
		'current_story': format_history(context.history),
	}
	
	# Generate candidate directions
	analysis_result = story_recalibration_analysis_agent.generate(analysis_payload)
	candidates = analysis_result['text']
	
	# Prepare payload for selection agent
	selection_payload = {
		'candidates': candidates,
		'current_direction': context.narrative_direction,
		'user_intent_analysis': context.user_intent_analysis or '',
	}
	
	# Select best direction
	selection_result = story_recalibration_selection_agent.generate(selection_payload)
	return parse_selected_direction(selection_result['text'])


def _generate_story_section(context: StoryContext) -> str:
	"""Generate the next story section using the story generation agent.

	Args:
		context: StoryContext with all generation parameters.

	Returns:
		Generated story content string.
	"""
	payload = {
		'avatar': f'{context.avatar.name}: {context.avatar.description or "No description"}',
		'story_setting': context.story_setting,
		'narrative_direction': context.narrative_direction,
		'current_story': format_history(context.history),
	}
	
	# Include user input if exists
	if context.user_input:
		payload['user_input'] = context.user_input
	
	# Include user intent analysis if available
	if context.user_intent_analysis:
		payload['user_intent_analysis'] = context.user_intent_analysis
		
	result = story_generation_agent.generate(payload)
	return result['text']


def _evaluate_story(
	context: StoryContext,
	generated_content: str,
) -> Tuple[StoryEvaluation, MissingElementsInfo]:
	"""Evaluate generated content for quality and element inclusion.
	
	Called on every generation to ensure story coherence with overall narrative.

	Args:
		context: StoryContext containing user_elements if any.
		generated_content: The generated story section to evaluate.

	Returns:
		Tuple of (StoryEvaluation, MissingElementsInfo).
		MissingElementsInfo will be empty if all elements present.
	"""
	missing_elements = MissingElementsInfo()

	# Check element inclusion if user requested elements
	if context.user_elements:
		elements_payload = {
			'generated_content': generated_content,
			'user_elements': context.user_elements,
			'user_intent_analysis': context.user_intent_analysis or '',
		}

		elements_result = story_elements_evaluation_agent.generate(elements_payload)
		missing_elements = parse_elements_evaluation(elements_result['text'])

	# Quality evaluation (always called)
	quality_payload = {
		'generated_content': generated_content,
		'current_story': format_history(context.history),
		'narrative_direction': context.narrative_direction,
	}

	quality_result = story_self_evaluation_agent.generate(quality_payload)
	evaluation = parse_quality_evaluation(quality_result['text'])

	# If elements are missing, mark as not satisfied
	if not missing_elements.is_empty():
		evaluation = StoryEvaluation(
			satisfied_user_request=False,
			quality_score=evaluation.quality_score,
			notes=f'{evaluation.notes or ""} Missing elements: {missing_elements.to_message()}'.strip(),
		)

	return evaluation, missing_elements


def _generate_with_evaluation(
	context: StoryContext,
) -> Tuple[str, StoryEvaluation, List[StoryMessage]]:
	"""Generation loop with self-evaluation and retry logic.

	Attempts generation up to MAX_REGENERATION_ATTEMPTS + 1 times (initial + retries).
	On each failed attempt, creates a metadata message noting the missing elements
	and updates context to explicitly request those elements.

	Args:
		context: StoryContext for generation.

	Returns:
		Tuple of:
			- str: Final generated content
			- StoryEvaluation: Final evaluation
			- List[StoryMessage]: Metadata messages from regeneration attempts
	"""
	metadata_messages: List[StoryMessage] = []
	generated_content = ''
	evaluation = StoryEvaluation(satisfied_user_request=False)

	for attempt in range(MAX_REGENERATION_ATTEMPTS + 1):
		generated_content = _generate_story_section(context)
		evaluation, missing_elements = _evaluate_story(context, generated_content)
		
		# Success or final attempt - return what we have
		if evaluation.satisfied_user_request or attempt == MAX_REGENERATION_ATTEMPTS:
			return generated_content, evaluation, metadata_messages

		# Regeneration needed - create metadata message
		missing_msg = StoryMessage(
			content=f'Regeneration attempt {attempt + 1}: Missing elements - {missing_elements.to_message()}',
			narrative_direction=context.narrative_direction,
			role=Role.metadata,
			metadata={
				'type': 'regeneration',
       			'missing_elements': missing_elements.to_message()
          },
		)
		metadata_messages.append(missing_msg)

		# Update context to explicitly mention missing elements for next generation
		explicit_instruction = f'[IMPORTANT: Please ensure the following elements are incorporated: {missing_elements.to_message()}]'
		updated_input = f'{context.user_input or ""}\n\n{explicit_instruction}'.strip()
		context = context.model_copy(update={'user_input': updated_input})

	# Fallback return (should not reach here due to final attempt logic above)
	return generated_content, evaluation, metadata_messages


# SCENE PREPARATION HELPER FUNCTIONS

def _select_location(avatar: StoryAvatar, story_setting: str) -> Tuple[str, str, str]:
	"""Select initial scene location via location_selection_agent.
	
	Args:
		avatar: StoryAvatar with protagonist details.
		story_setting: Story world context.
	
	Returns:
		Tuple of (selected_location_name, raw_agent_output, reasoning)
	"""
	payload = {
		'avatar': f'{avatar.name}: {avatar.description or "No description"}',
		'story_setting': story_setting,
	}
	result = location_selection_agent.generate(payload)
	raw_output = result['text']
	selected = parse_selected_location(raw_output)
	reasoning = parse_reasoning(raw_output)
	return selected, raw_output, reasoning


def _select_initial_direction(
	avatar: StoryAvatar, 
	story_setting: str, 
	location: str
) -> Tuple[str, str, str]:
	"""Select initial narrative direction via narrative_direction_agent.
	
	Args:
		avatar: StoryAvatar with protagonist details.
		story_setting: Story world context.
		location: Selected scene location.
	
	Returns:
		Tuple of (selected_direction, raw_agent_output, reasoning)
	"""
	payload = {
		'avatar': f'{avatar.name}: {avatar.description or "No description"}',
		'story_setting': story_setting,
		'selected_location': location,
	}
	result = narrative_direction_agent.generate(payload)
	raw_output = result['text']
	selected = parse_selected_direction(raw_output)
	reasoning = parse_reasoning(raw_output)
	return selected, raw_output, reasoning


def _select_props(
	avatar: StoryAvatar,
	story_setting: str,
	location: str,
	direction: str,
) -> Tuple[List[str], str, str]:
	"""Select scene props via scene_prop_selection_agent.
	
	Args:
		avatar: StoryAvatar with protagonist details.
		story_setting: Story world context.
		location: Selected scene location.
		direction: Current narrative direction.
	
	Returns:
		Tuple of (selected_props_list, raw_agent_output, reasoning)
	"""
	payload = {
		'avatar': f'{avatar.name}: {avatar.description or "No description"}',
		'story_setting': story_setting,
		'selected_location': location,
		'narrative_direction': direction,
	}
	result = scene_prop_selection_agent.generate(payload)
	raw_output = result['text']
	selected = parse_selected_props(raw_output)
	reasoning = parse_reasoning(raw_output)
	return selected, raw_output, reasoning


def _create_npcs(
	avatar: StoryAvatar,
	story_setting: str,
	location: str,
	direction: str,
	props: List[str],
) -> Tuple[List[str], str, str]:
	"""Create NPCs for scene via npc_creation_agent.
	
	Args:
		avatar: StoryAvatar with protagonist details.
		story_setting: Story world context.
		location: Selected scene location.
		direction: Current narrative direction.
		props: List of selected props in the scene.
	
	Returns:
		Tuple of (selected_characters_list, raw_agent_output, reasoning)
	"""
	payload = {
		'avatar': f'{avatar.name}: {avatar.description or "No description"}',
		'story_setting': story_setting,
		'selected_location': location,
		'narrative_direction': direction,
		'selected_props': ', '.join(props) if props else 'None',
	}
	result = npc_creation_agent.generate(payload)
	raw_output = result['text']
	selected = parse_selected_characters(raw_output)
	reasoning = parse_reasoning(raw_output)
	return selected, raw_output, reasoning


# MAIN FUNCTIONS

def initialize_story(
	avatar: StoryAvatar,
	story_setting: str,
) -> List[StoryMessage]:
	"""Orchestrate the initial scene construction and first agent-generated message.

	Performs full scene preparation:
	1. Select scene location
	2. Select initial narrative direction
	3. Select scene props
	4. Create NPCs
	5. Generate first story message via advance_story
	
	Args:
		avatar: StoryAvatar with protagonist name and description.
		story_setting: String describing the story world/context.

	Returns:
		List of StoryMessage objects including scene preparation metadata
		and the opening story turn.
	
	Example:
		>>> avatar = StoryAvatar(name="Luna", description="A brave explorer")
		>>> messages = initialize_story(avatar, "A magical forest full of secrets")
		>>> len(messages)  # Metadata + story message
		5
	"""
	if MOCK_MODE:
		return _mock_initialize_story(avatar, story_setting)

	_reset_all_agents_usage()
	metadata_messages: List[StoryMessage] = []

	# 1. Select location
	location, location_output, location_reasoning = _select_location(avatar, story_setting)
	metadata_messages.append(StoryMessage(
		content=location_output,
		narrative_direction='scene_preparation',
		role=Role.metadata,
		metadata={
			'type': 'location_selection',
			'selected': location,
			'reasoning': location_reasoning
		},
	))

	# 2. Select initial narrative direction
	direction, direction_output, direction_reasoning = _select_initial_direction(
		avatar, story_setting, location
	)
	metadata_messages.append(StoryMessage(
		content=direction_output,
		narrative_direction='scene_preparation',
		role=Role.metadata,
		metadata={
			'type': 'narrative_direction',
			'selected': direction,
			'reasoning': direction_reasoning
		},
	))

	# 3. Select props
	props, props_output, props_reasoning = _select_props(
		avatar, story_setting, location, direction
	)
	metadata_messages.append(StoryMessage(
		content=props_output,
		narrative_direction='scene_preparation',
		role=Role.metadata,
		metadata={
			'type': 'props_selection',
			'selected': ', '.join(props),
			'reasoning': props_reasoning
		},
	))

	# 4. Create NPCs
	characters, characters_output, characters_reasoning = _create_npcs(
		avatar, story_setting, location, direction, props
	)
	metadata_messages.append(StoryMessage(
		content=characters_output,
		narrative_direction='scene_preparation',
		role=Role.metadata,
		metadata={
			'type': 'character_creation',
			'selected': ', '.join(characters),
			'reasoning': characters_reasoning
		},
	))

	# 5. Generate first story message via advance_story
	story_messages, _ = advance_story(
		avatar=avatar,
		story_setting=story_setting,
		current_direction=direction,
		history=metadata_messages,
		user_input=None,
	)

	# Combine all messages
	all_messages = metadata_messages + story_messages

	# Token usage summary
	usage = _get_all_agents_usage()
	token_summary_msg = StoryMessage(
		content=f"Token usage for initialization:\n{json.dumps(usage, indent=2)}",
		narrative_direction="",
		role=Role.metadata,
		metadata={"type": "token_usage", "usage": json.dumps(usage)},
	)
	all_messages.append(token_summary_msg)
	
	print(f"\n[TOKEN SUMMARY] Initialization total: {usage['grand_total']['total_tokens']} tokens")
	print(f"[TOKEN SUMMARY] Per agent: {json.dumps(usage['per_agent'], indent=2)}")

	return all_messages


def advance_story(
	avatar: StoryAvatar,
	story_setting: str,
	current_direction: str,
	history: List[StoryMessage],
	user_input: Optional[str] = None,
) -> Tuple[List[StoryMessage], str]:
	if MOCK_MODE:
		return _mock_advance_story(avatar, story_setting, current_direction, history, user_input)

	_reset_all_agents_usage()
	"""Advance the story by running recalibration, generation, and evaluation.

	The routine:
	1. Analyzes user intent (if user input provided)
	2. Recalibrates narrative direction based on context
	3. Generates story content with evaluation and retry logic
	4. Returns the new messages and updated direction

	Args:
		avatar: StoryAvatar with protagonist details.
		story_setting: Story world context.
		current_direction: Current narrative direction.
		history: List of previous StoryMessage objects.
		user_input: Optional user guidance for this turn.

	Returns:
		Tuple of:
			- List[StoryMessage]: Generated messages (metadata + story content)
			- str: Narrative direction for the next turn.
	
	Example:
		>>> messages, new_direction = advance_story(
		...     avatar, story_setting, "Seek the hidden spring",
		...     history, user_input="Luna wants to find the fox."
		... )
		>>> messages[-1].role
		Role.assistant
	"""
	# Build initial context
	context = StoryContext(
		avatar=avatar,
		story_setting=story_setting,
		narrative_direction=current_direction,
		history=history,
		user_input=user_input,
	)
	
	# 1: Analyze user intent (if user input present)
	if user_input:
		intent_analysis = _analyze_user_intent(context)
		summary, user_elements = parse_user_intent(intent_analysis)
		context = context.model_copy(update={
			'user_intent_analysis': intent_analysis,
			'user_elements': user_elements if user_elements else None,
		})

	# 2: Recalibrate narrative direction
	new_direction = _recalibrate_narrative(context)
	context = context.model_copy(update={'narrative_direction': new_direction})

	# 3: Generate with evaluation and retry
	generated_content, evaluation, metadata_messages = _generate_with_evaluation(context)

	# 4: Build final StoryMessage
	story_message = StoryMessage(
		content=generated_content,
		narrative_direction=new_direction,
		role=Role.assistant,
		user_elements=context.user_elements,
		evaluation=evaluation,
	)

	# Combine metadata messages with story message
	all_messages = metadata_messages + [story_message]

	# Token usage summary
	usage = _get_all_agents_usage()
	token_summary_msg = StoryMessage(
		content=f"Token usage for this turn:\n{json.dumps(usage, indent=2)}",
		narrative_direction=new_direction,
		role=Role.metadata,
		metadata={"type": "token_usage", "usage": json.dumps(usage)},
	)
	all_messages.append(token_summary_msg)
	
	print(f"\n[TOKEN SUMMARY] Turn total: {usage['grand_total']['total_tokens']} tokens")
	print(f"[TOKEN SUMMARY] Per agent: {json.dumps(usage['per_agent'], indent=2)}")
	
	return all_messages, new_direction


# NON-MULTIAGENT BASELINE FUNCTION

def non_multiagent_generate(
	avatar: StoryAvatar,
	story_setting: str,
	history: List[StoryMessage],
	user_input: Optional[str] = None,
	system_directives: Optional[str] = None,
) -> StoryMessage:
	"""Generate a story section using only the main story_generation_agent.
	
	No multi-agent orchestration, for ablation/baseline experiments.

	Args:
		avatar: StoryAvatar with protagonist details.
		story_setting: Story world context.
		history: List of previous StoryMessage objects.
		user_input: Optional user guidance for this turn.
		system_directives: Optional system prompt to prepend to history.

	Returns:
		StoryMessage: The generated story message.
	
	Example:
		>>> message = non_multiagent_generate(avatar, story_setting, history)
		>>> message.role
		Role.assistant
	"""
	prompt = format_history(history)
	if system_directives:
		prompt = f"{system_directives}\n{prompt}"
	
	payload = {
		'avatar': f'{avatar.name}: {avatar.description or "No description"}',
		'story_setting': story_setting,
		'current_story': prompt,
	}
	
	if user_input:
		payload['user_input'] = user_input
	
	result = story_generation_agent.generate(payload)
	reasoning = parse_reasoning(result['text'])
	
	return StoryMessage(
		content=result['text'],
		narrative_direction="",
		role=Role.assistant,
		metadata={'reasoning': reasoning} if reasoning else None,
	)