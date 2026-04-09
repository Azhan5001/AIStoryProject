from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import (
	Column, Integer, String, DateTime, func, ForeignKey
)
from sqlmodel import SQLModel, Field

class Story(SQLModel, table=True):
	__tablename__ = "story"

	story_id: Optional[int] = Field(default=None, primary_key=True)
	user_id: int = Field(
     	sa_column=Column(Integer,
		ForeignKey("user.user_id"),
        nullable=False)
    )
	avatar_id: int = Field(
        sa_column=Column(Integer, 
        ForeignKey("avatar.avatar_id"),
        nullable=False)
    )
	story_setting_id: int = Field( 
        sa_column=Column(Integer,
        ForeignKey("story_setting.story_setting_id"),
    	nullable=False)
    )
	current_direction: Optional[str] = Field(
		default="",
		sa_column=Column(String, nullable=True)
	)
	created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    )
	deleted_at: Optional[datetime] = Field(
		default=None,
		sa_column=Column(DateTime(timezone=True), nullable=True),
	)


# class Story(Base):
# 	__tablename__ = 'story'

# 	story_id = Column(Integer, primary_key=True, autoincrement=True)
# 	user_id = Column(Integer, nullable=False, unique=True)
# 	avatar_id = Column(Integer, nullable=False, unique=True)
# 	story_setting_id = Column(Integer, nullable=False)
# 	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
# 	deleted_at = Column(DateTime(timezone=True), nullable=True)

# 	def __repr__(self):
# 		return f'<Story(story_id={self.story_id}, user_id={self.user_id!r}, avatar_id={self.avatar_id!r}), avatar_id={self.story_setting_id!r})>'

# 	def to_dict(self):
# 		'''Return a dict suitable for APIs (omit password).'''
# 		return {
# 			'story_id': self.story_id,
# 			'user_id': self.user_id,
# 			'avatar_id': self.avatar_id,
# 			'story_setting_id': self.story_setting_id,
# 			'created_at': self.created_at,
# 			'deleted_at': self.deleted_at,
# 		}
