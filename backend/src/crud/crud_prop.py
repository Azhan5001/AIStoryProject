from sqlalchemy.orm import Session
from sqlmodel import select
from orm.prop import Prop
from typing import Optional, List

def get_props(db: Session) -> List[Prop]:
    '''Get all props.
    Parameters:
        - None
    Return
        - list[Prop]: list of prop records from the database'''
    return db.exec(select(Prop)).all()

def get_prop_by_id(db: Session, prop_id: int) -> Optional[Prop]:
    '''Get a single prop by its ID.
    
    Parameters:
        - None

    Return
        - Optional[Prop]: prop record from the database or None if not found'''
    return db.get(Prop, prop_id)

def get_props_by_avatar_id(db: Session, avatar_id: int) -> List[Prop]:
    '''Get props by avatar ID.
    Parameters:
        - avatar_id (int): The ID of the avatar to filter props.
    Return
        - list[Prop]: list of prop records from the database'''
    statement = select(Prop).where(Prop.avatar_id == avatar_id)
    return db.exec(statement).all()

def create_prop(db: Session, prop: Prop) -> Prop:
    '''Create a new prop.
    Parameters:
        - prop (Prop): The prop data to create.
    Return
        - Prop: The created prop record from the database'''
    db_prop = Prop.model_validate(prop)
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)
    return db_prop

def update_prop_by_id(db: Session, prop_id: int, prop: Prop) -> Optional[Prop]:
    '''Update a prop by its ID.
    Parameters:
        - prop_id (int): The ID of the prop to update.
        - prop (Prop): The prop data to update.
    Return
        - Optional[Prop]: The updated prop record from the database or None if not found'''
    db_prop = get_prop_by_id(db, prop_id)
    if not db_prop:
        return None
    for key, value in prop.model_dump(exclude_unset=True).items():
        setattr(db_prop, key, value)
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)
    return db_prop

def delete_prop_by_id(db: Session, prop_id: int) -> bool:
    '''Delete a prop by its ID.
    Parameters:
        - prop_id (int): The ID of the prop to delete.
    Return
        - bool: True if the prop was deleted, False if not found'''
    db_prop = get_prop_by_id(db, prop_id)
    if not db_prop:
        return False
    db.delete(db_prop)
    db.commit()
    return True