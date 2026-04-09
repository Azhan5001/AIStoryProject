from sqlalchemy.orm import Session
from sqlmodel import select
from orm.scene_prop import SP 
from typing import Optional, List

def get_scene_props(db: Session) -> List[SP]:
    '''Get all scene props.
    Parameters:
        - None
    Return
        - list[SP]: list of scene prop records from the database'''
    return db.exec(select(SP)).all()

def get_scene_prop_by_id(db: Session, scene_prop_id: int) -> Optional[SP]:
    '''Get a single scene prop by its ID.
    
    Parameters:
        - None

    Return
        - Optional[SP]: scene prop record from the database or None if not found'''
    return db.get(SP, scene_prop_id)

def get_scene_props_by_scene_id(db: Session, scene_id: int) -> List[SP]:
    '''Get scene props by scene ID.
    Parameters:
        - scene_id (int): The ID of the scene to filter scene props.
    Return
        - list[SP]: list of scene prop records from the database'''
    statement = select(SP).where(SP.scene_id == scene_id)
    return db.exec(statement).all()

def get_scene_props_by_prop_id(db: Session, prop_id: int) -> List[SP]:
    '''Get scene props by prop ID.
    Parameters:
        - prop_id (int): The ID of the prop to filter scene props.
    Return
        - list[SP]: list of scene prop records from the database'''
    statement = select(SP).where(SP.prop_id == prop_id)
    return db.exec(statement).all()

def create_scene_prop(db: Session, scene_prop: SP) -> SP:
    '''Create a new scene prop.
    Parameters:
        - scene_prop (SP): The scene prop data to create.
    Return
        - SP: The created scene prop record from the database'''
    db_scene_prop = SP.model_validate(scene_prop)
    db.add(db_scene_prop)
    db.commit()
    db.refresh(db_scene_prop)
    return db_scene_prop

def update_scene_prop_by_id(db: Session, scene_prop_id: int, scene_prop: SP) -> Optional[SP]:
    '''Update a scene prop by its ID.
    Parameters:
        - scene_prop_id (int): The ID of the scene prop to update.
        - scene_prop (SP): The scene prop data to update.
    Return
        - Optional[SP]: The updated scene prop record from the database or None if not found'''
    db_scene_prop = get_scene_prop_by_id(db, scene_prop_id)
    if not db_scene_prop:
        return None
    for key, value in scene_prop.model_dump(exclude_unset=True).items():
        setattr(db_scene_prop, key, value)
    db.add(db_scene_prop)
    db.commit()
    db.refresh(db_scene_prop)
    return db_scene_prop

def delete_scene_prop_by_id(db: Session, scene_prop_id: int) -> bool:
    '''Delete a scene prop by its ID.
    Parameters:
        - scene_prop_id (int): The ID of the scene prop to delete.
    Return
        - bool: True if the scene prop was deleted, False if not found'''
    db_scene_prop = get_scene_prop_by_id(db, scene_prop_id)
    if not db_scene_prop:
        return False
    db.delete(db_scene_prop)
    db.commit()
    return True