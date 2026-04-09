from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SqlEnum, DateTime, func
import enum

class Role(str, enum.Enum):
    user_messages = "user"
    system_messages = "system"
    assistant = "assistant"
    internal = "internal"
    metadata = "metadata"

class Message(SQLModel, table=True):
    __tablename__ = "message"
 
    message_id: Optional[int] = Field(default=None, primary_key=True)
    story_id: int = Field(default=None, foreign_key="story.story_id")
    scene_id: Optional[int] = Field(default=None, foreign_key="scene.scene_id")
    content: str
    message_label: Optional[str] = Field(default="")
    role: Role = Field(sa_column=Column(SqlEnum(Role), nullable=True))
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
	)
    deleted_at: Optional[datetime] = Field(default=None)
    
