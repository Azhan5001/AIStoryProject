from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func

class Prop(SQLModel, table=True):
    __tablename__ = "prop"

    prop_id: Optional[int] = Field(default=None, primary_key=True)
    avatar_id: Optional[int] = Field(default=None, foreign_key="avatar.avatar_id")
    prop_description: str
    prop_category: str
    prop_state: str
    resource_path: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    )
    deleted_at: Optional[datetime] = Field(default=None)