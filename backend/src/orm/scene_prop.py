from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func

class SceneProp(SQLModel, table=True):
    __tablename__ = "scene_prop"

    scene_prop_id: Optional[int] = Field(default=None, primary_key=True)
    prop_id: Optional[int] = Field(default=None, foreign_key="prop.prop_id")
    scene_id: int = Field(foreign_key="scene.scene_id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    )
    removed_at: Optional[datetime] = Field(default=None)
    deleted_at: Optional[datetime] = Field(default=None)