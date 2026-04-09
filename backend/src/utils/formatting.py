"""
Formatting functions for preparing data for LLM consumption or display.

These functions transform structured data (StoryMessage lists, etc.) into
string formats suitable for LLM context windows or user-facing display.

Design principles:
- Output is always a string (never None)
- Formatting is deterministic (same input = same output)
- No side effects (pure functions)
"""

from typing import List

from schemas.story_generation import StoryMessage
from schemas.message import Role


def format_history(history: List[StoryMessage]) -> str:
	"""Format message history into a string for LLM context consumption.
	
	LLM agents need the conversation history as a single text block.
	This function formats each message with a role label for clarity.
	
	Args:
		history: List of StoryMessage objects representing the conversation.
			Each message has 'role' (Role enum or str) and 'content' (str) attributes.
	
	Returns:
		Formatted string with each message on its own block.
		Format: "[role] content" separated by double newlines.
		Returns empty string if history is empty.
	
	Example:
		>>> from src.schemas.message import Role
		>>> messages = [
		...     StoryMessage(content="Hello", role=Role.user, narrative_direction=""),
		...     StoryMessage(content="Hi there!", role=Role.assistant, narrative_direction=""),
		... ]
		>>> format_history(messages)
		"[user] Hello\\n\\n[assistant] Hi there!"
	
	Note:
		- Role is converted to lowercase string value
		- Messages with empty content are still included (with empty content)
		- Metadata messages are included with their role label
	"""
	if not history:
		return ""
	
	lines = []
	
	for msg in history:
		# Get role as string (handle both enum and string cases)
		if hasattr(msg.role, 'value'):
			role_label = msg.role.value
		else:
			role_label = str(msg.role)
		
		content = getattr(msg, 'content', '')
		lines.append(f'[{role_label}] {content}')
	
	return '\n\n'.join(lines)


def filter_visible_messages(messages: List[StoryMessage]) -> List[StoryMessage]:
	"""Filter messages to show only user-visible content.
	
	Not all messages should be shown to users. System prompts, internal
	agent reasoning, and metadata are hidden. This function returns only
	the messages that users should see.
	
	Args:
		messages: List of StoryMessage objects (may include all roles).
	
	Returns:
		New list containing only messages with these roles:
			- Role.user (user input)
			- Role.assistant (AI story responses)
		
		Original list is not modified.
	
	Example:
		>>> from src.schemas.message import Role
		>>> msgs = [
		...     StoryMessage(content="System setup", role=Role.metadata, narrative_direction=""),
		...     StoryMessage(content="User said hi", role=Role.user, narrative_direction=""),
		...     StoryMessage(content="AI responds", role=Role.assistant, narrative_direction=""),
		... ]
		>>> visible = filter_visible_messages(msgs)
		>>> len(visible)
		2
	
	Note:
		Excluded roles: Role.system, Role.metadata, Role.internal
	"""
	visible_roles = {Role.user_messages, Role.assistant}
	
	filtered = []
	for msg in messages:
		# Handle both enum and string role values
		if hasattr(msg.role, 'value'):
			role_value = msg.role
		else:
			try:
				role_value = Role(msg.role)
			except ValueError:
				continue  # Skip unknown roles
		
		if role_value in visible_roles:
			filtered.append(msg)
	
	return filtered


def build_runtime_prompt(system_directives: str, user_input: str) -> str:
	"""Combine system directives with user input into a single prompt.
	
	Some generation calls need to prepend system-level instructions
	before the user's actual input. This function combines them cleanly.
	
	Args:
		system_directives: System-level instructions or context to prepend.
			Can be empty string if no directives needed.
		user_input: The user's actual input or the content to generate from.
	
	Returns:
		Combined string with directives first (if present), then user input.
		Format: "{directives}\\n\\n{user_input}" or just "{user_input}"
	
	Example:
		>>> build_runtime_prompt("Be creative", "Write a story")
		"Be creative\\n\\nWrite a story"
		
		>>> build_runtime_prompt("", "Write a story")
		"Write a story"
		
		>>> build_runtime_prompt("   ", "Write a story")
		"Write a story"
	"""
	if system_directives and system_directives.strip():
		return f"{system_directives.strip()}\n\n{user_input}"
	
	return user_input