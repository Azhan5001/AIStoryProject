"""
Parsing functions for extracting structured data from LLM agent text outputs.

Each function corresponds to a specific agent's output format and extracts
the relevant information into Python data structures.

Design principles:
- Never raise exceptions on malformed input; return sensible defaults
- Each function documents the expected input format with examples
- Return types are always consistent (no None vs empty list ambiguity)

Agent-to-parser mapping:
- user_intent_analysis_agent -> parse_user_intent()
- location_selection_agent -> parse_selected_location()
- scene_prop_selection_agent -> parse_selected_props()
- npc_creation_agent -> parse_selected_characters()
- narrative_direction_agent, story_recalibration_selection_agent -> parse_selected_direction()
- story_elements_evaluation_agent -> parse_elements_evaluation()
- story_self_evaluation_agent -> parse_quality_evaluation()
- Any agent with rationale -> parse_reasoning()
"""

from typing import List, Tuple

from schemas.story_generation import MissingElementsInfo, StoryEvaluation


def parse_reasoning(text: str) -> str:
	"""Extract reasoning/rationale section from any agent output.
	
	Agents often include a reasoning line to explain their decisions.
	This function extracts that explanation for logging or display.
	
	Args:
		text: Raw agent output text. May contain one of these line prefixes:
			- "SELECTION RATIONALE: <reasoning>"
			- "RATIONALE: <reasoning>"  
			- "REASONING: <reasoning>"
	
	Returns:
		The reasoning text after the prefix, stripped of whitespace.
		Returns empty string if no reasoning line is found.
	
	Example:
		>>> parse_reasoning("SELECTED: Option A\\nSELECTION RATIONALE: Best fit for the scene")
		"Best fit for the scene"
		
		>>> parse_reasoning("No reasoning here")
		""
	"""
	prefixes = ["SELECTION RATIONALE:", "RATIONALE:", "REASONING:"]
	
	for line in text.strip().split('\n'):
		line = line.strip()
		for prefix in prefixes:
			if line.startswith(prefix):
				return line.replace(prefix, '').strip()
	
	return ""


def parse_user_intent(intent_text: str) -> Tuple[str, List[str]]:
	"""Extract user intent summary and story elements from intent analysis output.
	
	The user_intent_analysis_agent produces structured output describing what
	the user wants to add/modify in the story. This function extracts:
	1. A summary of the user's intent
	2. A flat list of all story elements mentioned (characters, props, locations, other)
	
	Args:
		intent_text: Raw output from user_intent_analysis_agent.
			Expected format:
			```
			INTENT TYPE: add_element
			
			ELEMENTS IDENTIFIED:
			- Characters: dragon, knight
			- Props: magical sword, ancient map
			- Locations: dark cave
			- Other: thunderstorm
			
			USER PREFERENCES: none detected
			
			SUMMARY: User wants to introduce a dragon encounter
			```
	
	Returns:
		Tuple of:
			- summary (str): Content after "SUMMARY:" line, or empty string
			- elements (List[str]): All non-"none" elements combined into flat list
		
		Example return: ("User wants a dragon", ["dragon", "knight", "magical sword"])
	
	Note:
		- Elements listed as "none" are excluded from the result
		- Empty or malformed input returns ("", [])
		- Whitespace is stripped from all extracted values
	"""
	elements: List[str] = []
	summary: str = ""
	
	if not intent_text or not intent_text.strip():
		return summary, elements
	
	lines = intent_text.strip().split('\n')
	
	for line in lines:
		line = line.strip()
		
		if line.startswith('SUMMARY:'):
			summary = line.replace('SUMMARY:', '').strip()
		
		elif line.startswith('- Characters:'):
			chars = line.replace('- Characters:', '').strip()
			if chars.lower() != 'none':
				elements.extend([c.strip() for c in chars.split(',') if c.strip()])
		
		elif line.startswith('- Props:'):
			props = line.replace('- Props:', '').strip()
			if props.lower() != 'none':
				elements.extend([p.strip() for p in props.split(',') if p.strip()])
		
		elif line.startswith('- Locations:'):
			locs = line.replace('- Locations:', '').strip()
			if locs.lower() != 'none':
				elements.extend([loc.strip() for loc in locs.split(',') if loc.strip()])
		
		elif line.startswith('- Other:'):
			other = line.replace('- Other:', '').strip()
			if other.lower() != 'none':
				elements.extend([o.strip() for o in other.split(',') if o.strip()])
	
	return summary, elements


def parse_selected_location(text: str) -> str:
	"""Extract selected location name from location_selection_agent output.
	
	The location_selection_agent proposes multiple candidate locations and
	selects one. This function extracts the selected location name.
	
	Args:
		text: Raw output from location_selection_agent.
			Expected to contain a line: "SELECTED LOCATION: <location name>"
	
	Returns:
		The location name after "SELECTED LOCATION:", stripped of whitespace.
		If not found, returns the entire text stripped as fallback
		(assumes the agent returned just the location name).
	
	Example:
		>>> text = "LOCATION CANDIDATES:\\n1. Forest\\n\\nSELECTED LOCATION: Enchanted Grove"
		>>> parse_selected_location(text)
		"Enchanted Grove"
		
		>>> parse_selected_location("Just a location name")
		"Just a location name"
	"""
	for line in text.strip().split('\n'):
		line = line.strip()
		if line.startswith('SELECTED LOCATION:'):
			return line.replace('SELECTED LOCATION:', '').strip()
	
	# Fallback: return entire text if no explicit label found
	return text.strip()


def parse_selected_props(text: str) -> List[str]:
	"""Extract selected props list from scene_prop_selection_agent output.
	
	The scene_prop_selection_agent proposes candidate props (physical objects)
	for a scene and selects a subset. This extracts the selected items.
	
	Args:
		text: Raw output from scene_prop_selection_agent.
			Expected to contain: "SELECTED PROPS: item1, item2, item3"
	
	Returns:
		List of prop names, each stripped of whitespace.
		Returns empty list if "SELECTED PROPS:" line is not found.
	
	Example:
		>>> text = "PROP CANDIDATES:\\n1. Sword\\n\\nSELECTED PROPS: ancient sword, leather satchel"
		>>> parse_selected_props(text)
		["ancient sword", "leather satchel"]
		
		>>> parse_selected_props("No props line here")
		[]
	"""
	for line in text.strip().split('\n'):
		line = line.strip()
		if line.startswith('SELECTED PROPS:'):
			props_str = line.replace('SELECTED PROPS:', '').strip()
			return [p.strip() for p in props_str.split(',') if p.strip()]
	
	return []


def parse_selected_characters(text: str) -> List[str]:
	"""Extract selected NPC names from npc_creation_agent output.
	
	The npc_creation_agent proposes candidate NPCs (non-player characters)
	for a scene and selects which ones to include. This extracts those names.
	
	Args:
		text: Raw output from npc_creation_agent.
			Expected to contain: "SELECTED CHARACTERS: name1, name2"
	
	Returns:
		List of character names, each stripped of whitespace.
		Returns empty list if "SELECTED CHARACTERS:" line is not found.
	
	Example:
		>>> text = "CHARACTER CANDIDATES:\\n1. Old Wizard\\n\\nSELECTED CHARACTERS: Merlin, Forest Spirit"
		>>> parse_selected_characters(text)
		["Merlin", "Forest Spirit"]
		
		>>> parse_selected_characters("No characters line")
		[]
	"""
	for line in text.strip().split('\n'):
		line = line.strip()
		if line.startswith('SELECTED CHARACTERS:'):
			chars_str = line.replace('SELECTED CHARACTERS:', '').strip()
			return [c.strip() for c in chars_str.split(',') if c.strip()]
	
	return []


def parse_selected_direction(selection_text: str) -> str:
	"""Extract selected narrative direction from recalibration selection output.
	
	The story_recalibration_selection_agent and narrative_direction_agent
	choose a narrative direction. This extracts that selected direction phrase.
	
	Args:
		selection_text: Raw output from story_recalibration_selection_agent
			or narrative_direction_agent.
			Expected to contain: "SELECTED DIRECTION: <direction phrase>"
	
	Returns:
		The direction phrase after "SELECTED DIRECTION:", stripped.
		If not found, returns the entire text stripped as fallback
		(assumes the agent returned just the direction).
	
	Example:
		>>> text = "SELECTED DIRECTION: Luna discovers a hidden path"
		>>> parse_selected_direction(text)
		"Luna discovers a hidden path"
		
		>>> parse_selected_direction("Just a direction phrase")
		"Just a direction phrase"
	"""
	for line in selection_text.strip().split('\n'):
		line = line.strip()
		if line.startswith('SELECTED DIRECTION:'):
			return line.replace('SELECTED DIRECTION:', '').strip()
	
	# Fallback: return entire text if no explicit label found
	return selection_text.strip()


def parse_elements_evaluation(eval_text: str) -> MissingElementsInfo:
	"""Extract missing elements from story_elements_evaluation_agent output.
	
	After story generation, we check if user-requested elements were included.
	This agent marks each element as PRESENT or MISSING. This function
	extracts all MISSING elements grouped by category.
	
	Args:
		eval_text: Raw output from story_elements_evaluation_agent.
			Expected format:
			```
			ELEMENTS EVALUATION:
			
			Characters:
			- dragon: PRESENT
			- knight: MISSING
			
			Props:
			- sword: MISSING
			
			Locations:
			- cave: PRESENT
			
			Other:
			- none
			
			ALL ELEMENTS PRESENT: NO
			MISSING ELEMENTS SUMMARY: characters: knight; props: sword
			```
	
	Returns:
		MissingElementsInfo with lists of missing elements per category.
		All lists are empty if no elements are missing or input is malformed.
	
	Example:
		>>> info = parse_elements_evaluation(eval_text)
		>>> info.characters
		["knight"]
		>>> info.props
		["sword"]
		>>> info.is_empty()
		False
	"""
	missing = MissingElementsInfo()
	
	if not eval_text or not eval_text.strip():
		return missing
	
	lines = eval_text.strip().split('\n')
	current_category = None
	
	for line in lines:
		line = line.strip()
		
		# Detect category headers
		if line == 'Characters:':
			current_category = 'characters'
		elif line == 'Props:':
			current_category = 'props'
		elif line == 'Locations:':
			current_category = 'locations'
		elif line == 'Other:':
			current_category = 'other'
		
		# Parse element lines within a category
		elif line.startswith('- ') and current_category:
			content = line[2:]  # Remove "- " prefix
			
			if ': MISSING' in content:
				element_name = content.replace(': MISSING', '').strip()
				
				if current_category == 'characters':
					missing.characters.append(element_name)
				elif current_category == 'props':
					missing.props.append(element_name)
				elif current_category == 'locations':
					missing.locations.append(element_name)
				elif current_category == 'other':
					missing.other.append(element_name)
	
	return missing


def parse_quality_evaluation(eval_text: str) -> StoryEvaluation:
	"""Extract quality metrics from story_self_evaluation_agent output.
	
	After generation, we evaluate the story section's quality. This agent
	provides satisfaction status, a numeric score, and notes. This function
	extracts those into a StoryEvaluation object.
	
	Args:
		eval_text: Raw output from story_self_evaluation_agent.
			Expected format:
			```
			QUALITY EVALUATION:
			
			COHERENCE: GOOD
			Explanation: The story flows naturally.
			
			DIRECTION ALIGNMENT: ALIGNED
			Explanation: Matches the narrative direction.
			
			ENGAGEMENT: HIGH
			Explanation: Compelling scene.
			
			OVERALL SATISFIED: YES
			
			QUALITY SCORE: 0.85
			
			NOTES: Well-written section with good pacing.
			```
	
	Returns:
		StoryEvaluation with:
			- satisfied_user_request: True if "OVERALL SATISFIED: YES"
			- quality_score: Float from 0.0-1.0, or None if not parseable
			- notes: Content after "NOTES:", or None
	
	Example:
		>>> evaluation = parse_quality_evaluation(eval_text)
		>>> evaluation.satisfied_user_request
		True
		>>> evaluation.quality_score
		0.85
		>>> evaluation.notes
		"Well-written section with good pacing."
	"""
	satisfied = False
	score = None
	notes = None
	
	if not eval_text or not eval_text.strip():
		return StoryEvaluation(satisfied_user_request=satisfied)
	
	lines = eval_text.strip().split('\n')
	
	for line in lines:
		line = line.strip()
		
		if line.startswith('OVERALL SATISFIED:'):
			value = line.replace('OVERALL SATISFIED:', '').strip().upper()
			satisfied = (value == 'YES')
		
		elif line.startswith('QUALITY SCORE:'):
			score_str = line.replace('QUALITY SCORE:', '').strip()
			try:
				score = float(score_str)
				# Clamp to valid range
				score = max(0.0, min(1.0, score))
			except ValueError:
				score = None
		
		elif line.startswith('NOTES:'):
			notes = line.replace('NOTES:', '').strip()
			if not notes:
				notes = None
	
	return StoryEvaluation(
		satisfied_user_request=satisfied,
		quality_score=score,
		notes=notes,
	)