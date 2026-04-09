from sqlalchemy.orm import Session
from sqlmodel import select
from orm.avatar import Avatar
from typing import Optional, List

def get_avatars(db: Session) -> List[Avatar]:
    '''Get all avatars.
    Parameters:
        - None
    Return
        - list[Avatar]: list of avatar records from the database'''
    return db.exec(select(Avatar)).all()
def get_avatar_by_id(db: Session, avatar_id: int) -> Optional[Avatar]:
    '''Get a single avatar by its ID.
    
    Parameters:
        - None

    Return
        - Optional[Avatar]: avatar record from the database or None if not found'''
    return db.get(Avatar, avatar_id)

def create_avatar(db: Session, avatar: Avatar) -> Avatar:
    '''Create a new avatar.
    Parameters:
        - avatar (Avatar): The avatar data to create.
    Return
        - Avatar: The created avatar record from the database'''
    db_avatar = Avatar.model_validate(avatar)
    db.add(db_avatar)
    db.commit()
    db.refresh(db_avatar)
    return db_avatar

def update_avatar_by_id(db: Session, avatar_id: int, avatar: Avatar) -> Optional[Avatar]:
    '''Update an avatar by its ID.
    Parameters:
        - avatar_id (int): The ID of the avatar to update.
        - avatar (Avatar): The avatar data to update.
    Return
        - Optional[Avatar]: The updated avatar record from the database or None if not found'''
    db_avatar = get_avatar_by_id(db, avatar_id)
    if not db_avatar:
        return None
    for key, value in avatar.model_dump(exclude_unset=True).items():
        setattr(db_avatar, key, value)
    db.add(db_avatar)
    db.commit()
    db.refresh(db_avatar)
    return db_avatar

def delete_avatar_by_id(db: Session, avatar_id: int) -> bool:
    '''Delete an avatar by its ID.
    Parameters:
        - avatar_id (int): The ID of the avatar to delete.
    Return
        - bool: True if the avatar was deleted, False if not found'''
    db_avatar = get_avatar_by_id(db, avatar_id)
    if not db_avatar:
        return False
    db.delete(db_avatar)
    db.commit()
    return True
