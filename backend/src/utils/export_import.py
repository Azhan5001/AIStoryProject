"""
Export and import functions for story state persistence.

These functions serialize story state to JSON for:
- Saving progress to files
- Sharing stories between users
- Debugging and inspection

The export format is designed for:
1. Easy consumption by frontend (clear structure with meaningful keys)
2. Complete state reconstruction (all data preserved)
3. Human readability (formatted JSON)

Export structure:
{
	"story": {
		"avatar": {"name": str, "description": str | None},
		"story_setting": str,
		"narrative_direction": str,
		"created_at": str (ISO format)
	},
	"messages": [
		{"id": int, "content": str, "role": str, "timestamp": str | None, ...}
	],
	"metadata_log": [
		{"id": int, "type": str, "content": str, "selected": str | None, ...}
	]
}
"""

import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from schemas.story_generation import StoryMessage, StoryAvatar
from schemas.message import Role


def export_story(
	avatar: StoryAvatar,
	story_setting: str,
	narrative_direction: str,
	messages: List[StoryMessage],
	created_at: Optional[datetime] = None,
) -> Dict[str, Any]:
	"""Export complete story state to a dictionary structure.
	
	Creates a comprehensive export of the story that can be:
	- Serialized to JSON for file storage
	- Sent to frontend for display
	- Used to reconstruct the story state later
	
	Args:
		avatar: StoryAvatar containing protagonist details.
			Must have 'name' attribute; 'description' is optional.
		story_setting: The story world/context description string.
		narrative_direction: Current narrative direction the story is heading.
		messages: List of all StoryMessage objects in the conversation.
			Includes both visible messages and metadata.
		created_at: When the story was created. Defaults to current UTC time.
	
	Returns:
		Dictionary with structure:
		{
			"story": {
				"avatar": {"name": str, "description": str | None},
				"story_setting": str,
				"narrative_direction": str,
				"created_at": str (ISO format)
			},
			"messages": [
				{
					"id": int,
					"content": str,
					"role": str,
					"timestamp": str | None,
					"narrative_direction": str | None,
					"metadata": dict | None
				},
				...
			],
			"metadata_log": [
				{
					"id": int,
					"type": str,
					"content": str,
					"selected": str | None,
					"reasoning": str | None,
					"timestamp": str | None
				},
				...
			]
		}
	
	Example:
		>>> avatar = StoryAvatar(name="Luna", description="Brave explorer")
		>>> export_data = export_story(avatar, "Magic forest", "Find the treasure", messages)
		>>> export_data["story"]["avatar"]["name"]
		"Luna"
		>>> len(export_data["messages"])  # User/assistant messages only
		5
	
	Note:
		- Messages with role 'metadata' go to metadata_log
		- Messages with role 'user' or 'assistant' go to messages
		- Each message gets an incremental 'id' for reference
	"""
	if created_at is None:
		created_at = datetime.now(timezone.utc)
	
	# Build story header
	story_data = {
		"avatar": {
			"name": avatar.name,
			"description": avatar.description,
		},
		"story_setting": story_setting,
		"narrative_direction": narrative_direction,
		"created_at": created_at.isoformat(),
	}
	
	# Separate messages into visible and metadata
	visible_messages: List[Dict[str, Any]] = []
	metadata_log: List[Dict[str, Any]] = []
	
	visible_id = 0
	metadata_id = 0
	
	for msg in messages:
		# Get role as string
		if hasattr(msg.role, 'value'):
			role_str = msg.role.value
		else:
			role_str = str(msg.role)
		
		# Get timestamp if available
		timestamp = None
		if hasattr(msg, 'created_at') and msg.created_at:
			timestamp = msg.created_at.isoformat() if hasattr(msg.created_at, 'isoformat') else str(msg.created_at)
		
		if role_str == 'metadata':
			# Extract metadata-specific fields
			metadata_type = None
			selected = None
			reasoning = None
			
			if hasattr(msg, 'metadata') and msg.metadata:
				if isinstance(msg.metadata, dict):
					metadata_type = msg.metadata.get('type')
					selected = msg.metadata.get('selected')
					reasoning = msg.metadata.get('reasoning')
			
			# Infer type from content if not explicitly set
			if not metadata_type:
				content = msg.content or ""
				if "Regeneration attempt" in content or "Missing elements" in content:
					metadata_type = "regeneration"
			
			metadata_log.append({
				"id": metadata_id,
				"type": metadata_type or "unknown",
				"content": msg.content,
				"selected": selected,
				"reasoning": reasoning,
				"timestamp": timestamp,
			})
			metadata_id += 1
		else:
			# User or assistant message
			visible_messages.append({
				"id": visible_id,
				"content": msg.content,
				"role": role_str,
				"timestamp": timestamp,
				"narrative_direction": getattr(msg, 'narrative_direction', None),
				"metadata": getattr(msg, 'metadata', None),
			})
			visible_id += 1
	
	return {
		"story": story_data,
		"messages": visible_messages,
		"metadata_log": metadata_log,
	}


def export_story_to_json(
	avatar: StoryAvatar,
	story_setting: str,
	narrative_direction: str,
	messages: List[StoryMessage],
	created_at: Optional[datetime] = None,
	indent: int = 2,
) -> str:
	"""Export story state as a formatted JSON string.
	
	Convenience wrapper around export_story() that returns JSON string
	instead of dictionary. Useful for file I/O.
	
	Args:
		avatar: StoryAvatar with protagonist details.
		story_setting: Story world description.
		narrative_direction: Current story direction.
		messages: All story messages.
		created_at: Story creation time. Defaults to current UTC time.
		indent: JSON indentation level (default 2 spaces).
	
	Returns:
		JSON string representation of the story export.
	
	Example:
		>>> json_str = export_story_to_json(avatar, setting, direction, messages)
		>>> with open("story.json", "w") as f:
		...     f.write(json_str)
	"""
	data = export_story(avatar, story_setting, narrative_direction, messages, created_at)
	return json.dumps(data, indent=indent, ensure_ascii=False)


def import_story(data: Dict[str, Any]) -> Dict[str, Any]:
	"""Import story state from a dictionary structure.
	
	Reconstructs story components from an export dictionary.
	This is the inverse of export_story().
	
	Args:
		data: Dictionary in the format produced by export_story().
			Must contain "story" and "messages" keys at minimum.
	
	Returns:
		Dictionary containing:
		{
			"avatar": StoryAvatar instance,
			"story_setting": str,
			"narrative_direction": str,
			"created_at": datetime or None,
			"messages": List[StoryMessage],
			"metadata_log": List[dict],  # Raw metadata entries
		}
	
	Raises:
		KeyError: If required keys are missing from input.
		ValueError: If data format is invalid.
	
	Example:
		>>> with open("story.json") as f:
		...     data = json.load(f)
		>>> story = import_story(data)
		>>> story["avatar"].name
		"Luna"
		>>> len(story["messages"])
		5
	"""
	# Validate required keys
	if "story" not in data:
		raise KeyError("Missing required 'story' key in import data")
	if "messages" not in data:
		raise KeyError("Missing required 'messages' key in import data")
	
	story_data = data["story"]
	
	# Reconstruct avatar
	avatar_data = story_data.get("avatar", {})
	avatar = StoryAvatar(
		name=avatar_data.get("name", "Unknown"),
		description=avatar_data.get("description"),
	)
	
	# Parse created_at
	created_at = None
	if story_data.get("created_at"):
		try:
			created_at = datetime.fromisoformat(story_data["created_at"])
		except (ValueError, TypeError):
			created_at = None
	
	# Reconstruct messages
	messages: List[StoryMessage] = []
	for msg_data in data["messages"]:
		# Map role string to Role enum
		role_str = msg_data.get("role")
		try:
			role = Role(role_str)
		except Exception:
			# Fall back to metadata for regeneration/missing elements or unknown roles
			role = Role.metadata
		
		messages.append(StoryMessage(
			content=msg_data.get("content", ""),
			role=role,
			narrative_direction=msg_data.get("narrative_direction", ""),
			metadata=msg_data.get("metadata"),
		))
	
	return {
		"avatar": avatar,
		"story_setting": story_data.get("story_setting", ""),
		"narrative_direction": story_data.get("narrative_direction", ""),
		"created_at": created_at,
		"messages": messages,
		"metadata_log": data.get("metadata_log", []),
	}


def import_story_from_json(json_str: str) -> Dict[str, Any]:
	"""Import story state from a JSON string.
	
	Convenience wrapper around import_story() that accepts JSON string
	instead of dictionary.
	
	Args:
		json_str: JSON string in the format produced by export_story_to_json().
	
	Returns:
		Same as import_story().
	
	Raises:
		json.JSONDecodeError: If JSON is malformed.
		KeyError: If required keys are missing.
	
	Example:
		>>> with open("story.json") as f:
		...     json_str = f.read()
		>>> story = import_story_from_json(json_str)
		>>> story["avatar"].name
		"Luna"
	"""
	data = json.loads(json_str)
	return import_story(data)