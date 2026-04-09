from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel

class Role(str, Enum): 
    '''
    Enum for message source types in story conversation.
    '''
    user_messages = "user"
    system_messages = "system"
    assistant = "assistant"
    internal = "internal"
    metadata = "metadata"
    
    
@dataclass
class Message:
    """
    A single chat message within a conversation.
    Attributes:
      id (str): Unique message identifier.
      role (Role): Sender role. Values: USER, ASSISTANT, SYSTEM, INTERNAL, METADATA.
      content (str): The textual content of the message.
      timestamp (str): ISO 8601 timestamp (UTC) of creation.
    """
    id: str
    role: Role
    content: str
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    
    @property
    def is_metadata(self) -> bool:
        """True if this message is metadata/internal and not user-visible by default."""
        return self.role in {Role.system_messages, Role.internal, Role.metadata}
    
    def to_json_dict(self) -> Dict[str, Any]:
        """Serialize the Message to a JSON-friendly dictionary."""
        return {
            "id": self.id,
            "role": self.role.name,
            "content": self.content,
            "timestamp": self.timestamp,
        }
        
    @classmethod
    def from_json_dict(cls, d: Dict[str, Any]) -> "Message":
        """Deserialize a Message from a dictionary produced by to_json_dict."""
        role_name = d.get("role", Role.system_messages.name)
        role = Role[role_name] if role_name in Role.__members__ else Role.system_messages
        return cls(
            id=d.get("id", ""),
            role=role,
            content=d.get("content", ""),
            timestamp=d.get("timestamp", datetime.now(timezone.utc).isoformat() + "Z"),
        )
        
        
@dataclass
class Conversation:
    """
    A collection of messages forming a single chat session.
    Attributes:
      messages (List[Message]): Ordered messages in the session.
      system_directives (str): Runtime directives prepended to prompts.
      origin (str): Descriptor of how this conversation started.
      created_at (str): ISO 8601 timestamp when the conversation was created.
    """
    messages: List[Message] = field(default_factory=list)
    system_directives: str = ""
    origin: str = ""
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    
    def add_message(self, msg: Message) -> None:
        """Append a Message to the conversation."""
        self.messages.append(msg)
        
    def visible_messages(self) -> List[Message]:
        """
        Return messages visible to the user by default.
        Only USER and ASSISTANT roles are surfaced.
        SYSTEM/INTERNAL/METADATA are hidden from the user view.
        """
        return [m for m in self.messages if m.role in {Role.user_messages, Role.assistant}]
    
    def to_json_dict(self) -> Dict[str, Any]:
        """Serialize the conversation (including full log and metadata)."""
        return {
            "messages": [m.to_json_dict() for m in self.messages],
            "system_directives": self.system_directives,
            "origin": self.origin,
            "created_at": self.created_at,
        }
        
    @classmethod
    def from_json_dict(cls, d: Dict[str, Any]) -> "Conversation":
        """Deserialize a Conversation from a dictionary produced by to_json_dict."""
        msgs = [Message.from_json_dict(md) for md in d.get("messages", [])]
        return cls(
            messages=msgs,
            system_directives=d.get("system_directives", ""),
            origin=d.get("origin", ""),
            created_at=d.get("created_at", datetime.now(timezone.utc).isoformat()),
        )


class MessageCreate(BaseModel):
    '''
    Creating a message in story conversation.
    '''
    story_id: Optional[int] = None  # Optional because it can come from URL path
    scene_id: Optional[int] = None # Scene may not be determined yet so it's optional
    content: str
    message_label: Optional[str] = ""
    role: Role = Role.user_messages
    
    
class MessageRead(BaseModel):
    '''
    Returning message information.
    Used when displaying conversation history/story transcript.
    '''
    message_id: int
    story_id: int
    scene_id: Optional[int] = None
    content: str
    message_label: Optional[str] = None
    role: Role
    created_at: datetime
    
    class Config:
        from_attributes = True
    
    
class MessageUpdate(BaseModel):
    '''
    Updating the message content when needed.
    Used when user edits their previous message in conversation.
    
    Optional.
    '''
    content: Optional[str] = None
    message_label: Optional[str] = None