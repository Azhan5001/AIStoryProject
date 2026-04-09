from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import (
	Column, Integer, String, DateTime, func
)
from sqlmodel import SQLModel, Field

# SQLModel
class User(SQLModel, table=True):
	user_id: int = Field(primary_key=True)
	username: str = Field(unique=True, nullable=False)
	email: str = Field(unique=True, nullable=False)
	password: str
	session_id: str = Field(default=None, unique=True, nullable=True) # Made nullable as of now since we want default use (Can be changed later)
	access_level: str
	created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    )
	deleted_at: Optional[datetime] = Field(default=None)

# SQLAlchemy
# from database.database import Base
# class User(Base):
# 	__tablename__ = 'users'

# 	user_id = Column(Integer, primary_key=True, autoincrement=True)
# 	username = Column(String, nullable=False, unique=True)
# 	email = Column(String, nullable=False, unique=True)
# 	password = Column(String, nullable=False)
# 	session_id = Column(String, nullable=True, unique=True)
# 	access_level = Column(String, nullable=False)
# 	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
# 	deleted_at = Column(DateTime(timezone=True), nullable=True)

# 	def __repr__(self):
# 		return f'<User(user_id={self.user_id}, username={self.username!r}, email={self.email!r})>'

# 	def to_dict(self):
# 		'''Return a dict suitable for APIs (omit password).'''
# 		return {
# 			'user_id': self.user_id,
# 			'username': self.username,
# 			'email': self.email,
# 			'session_id': self.session_id,
# 			'access_level': self.access_level,
# 			'created_at': self.created_at,
# 			'deleted_at': self.deleted_at,
# 		}
