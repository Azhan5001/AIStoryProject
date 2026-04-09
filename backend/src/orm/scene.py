from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func

class Scene(SQLModel, table=True):
	__tablename__ = "scene"

	scene_id: Optional[int] = Field(default=None, primary_key=True)
	story_id: int = Field(default=None, foreign_key="story.story_id")
	scene_name: str
	scene_description: str
	scene_graph: str
	created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    )
	deleted_at: Optional[datetime] = Field(default=None)