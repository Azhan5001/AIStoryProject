from sqlalchemy.orm import Session
from sqlmodel import select
from orm.user import User
from typing import Optional, List

def get_users(db: Session) -> List[User]:
	return db.exec(select(User)).all()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
	return db.get(User, user_id)

def get_user_by_username(db: Session, username: str) -> Optional[User]:
	statement = select(User).where(User.username == username)
	return db.exec(statement).first()

def create_user(db: Session, user: User) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user_by_id(db: Session, user_id: int, user: User) -> Optional[User]:
	db_user = get_user_by_id(db, user_id)
	if not db_user:
		return None
	for key, value in user.model_dump(exclude_unset=True).items():
		setattr(db_user, key, value)
	db.add(db_user)
	db.commit()
	db.refresh(db_user)
	return db_user

def delete_user_by_id(db: Session, user_id: int) -> bool:
	db_user = get_user_by_id(db, user_id)
	if not db_user:
		return False
	db.delete(db_user)
	db.commit()
	return True
