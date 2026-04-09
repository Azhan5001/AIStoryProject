from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

from .message import Role


class StoryAvatar(BaseModel):
    """Avatar portrait data required to orient the story agents."""

    name: str
    description: Optional[str] = None


class StoryEvaluation(BaseModel):
    """Signals whether a generated section met expectations."""

    satisfied_user_request: bool
    quality_score: Optional[float] = None
    notes: Optional[str] = None


class StoryMessage(BaseModel):
    """Schema that captures a single story turn produced by the agents."""

    content: str
    narrative_direction: str
    role: Role = Role.assistant
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: Optional[Dict[str, str]] = None
    user_elements: Optional[List[str]] = None
    evaluation: Optional[StoryEvaluation] = None
    
    def to_json_dict(self) -> dict:
        return {
            "content": self.content,
            "narrative_direction": self.narrative_direction,
            "role": self.role.value if hasattr(self.role, "value") else str(self.role),
            "created_at": self.created_at.isoformat(),
            "metadata": self.metadata,
            "user_elements": self.user_elements,
            "evaluation": self.evaluation.model_dump() if self.evaluation else None,
        }

class StoryContext(BaseModel):
    """
    Bundles recurring parameters for story generation pipeline.
    """
    
    avatar: StoryAvatar
    story_setting: str
    narrative_direction: str
    history: List[StoryMessage]
    user_input: Optional[str] = None
    user_intent_analysis: Optional[str] = None
    user_elements: Optional[List[str]] = None
    
class MissingElementsInfo(BaseModel):
	"""
	Captures which user-requested elements were not incorporated/generated.
	"""
 
	characters: List[str] = []
	props: List[str] = []
	locations: List[str] = []
	other: List[str] = []
 
	def to_message(self) -> str:
		"""
		Format as human-readable message for metadata.
  
		Returns format like: 'characters: dragon, knight; props: sword'
  		"""
		lines = []
		if self.characters:
			lines.append(f'characters: {", ".join(self.characters)}')
		if self.props:
			lines.append(f'props: {", ".join(self.props)}')
		if self.locations:
			lines.append(f'locations: {", ".join(self.locations)}')
		if self.other:
			lines.append(f'other: {", ".join(self.other)}')
		return '; '.join(lines) if lines else ''

	def is_empty(self) -> bool:
		"""
		Check if all element lists are empty.
  		"""
		return not (self.characters or self.props or self.locations or self.other)