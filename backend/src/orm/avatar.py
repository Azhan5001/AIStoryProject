from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func

class Avatar(SQLModel, table=True):
	__tablename__ = "avatar"

	avatar_id: Optional[int] = Field(default=None, primary_key=True)
	avatar_name: str 
	description: Optional[str] = Field(default=None)
	created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
	)
	deleted_at: Optional[datetime] = Field(default=None)
