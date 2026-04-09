from sqlalchemy.orm import Session
from sqlmodel import select
from orm.story_setting import StorySetting
from typing import Optional, List

def get_story_settings(db: Session) -> List[StorySetting]:
    '''Get all story settings.
    Parameters:
        - None
    Return
        - list[StorySetting]: list of story setting records from the database'''
    return db.exec(select(StorySetting)).all()

def get_story_setting_by_id(db: Session, story_setting_id: int) -> Optional[StorySetting]:
    '''Get a single story setting by its ID.
    
    Parameters:
        - None

    Return
        - Optional[StorySetting]: story setting record from the database or None if not found'''
    return db.get(StorySetting, story_setting_id)

def create_story_setting(db: Session, story_setting: StorySetting) -> StorySetting:
    '''Create a new story setting.
    Parameters:
        - story_setting (StorySetting): The story setting data to create.
    Return
        - StorySetting: The created story setting record from the database'''
    db_story_setting = StorySetting.model_validate(story_setting)
    db.add(db_story_setting)
    db.commit()
    db.refresh(db_story_setting)
    return db_story_setting

def update_story_setting_by_id(db: Session, story_setting_id: int, story_setting: StorySetting) -> Optional[StorySetting]:
    '''Update a story setting by its ID.
    Parameters:
        - story_setting_id (int): The ID of the story setting to update.
        - story_setting (StorySetting): The story setting data to update.
    Return
        - Optional[StorySetting]: The updated story setting record from the database or None if not found'''
    db_story_setting = get_story_setting_by_id(db, story_setting_id)
    if not db_story_setting:
        return None
    for key, value in story_setting.model_dump(exclude_unset=True).items():
        setattr(db_story_setting, key, value)
    db.add(db_story_setting)
    db.commit()
    db.refresh(db_story_setting)
    return db_story_setting

def delete_story_setting_by_id(db: Session, story_setting_id: int) -> bool:
    '''Delete a story setting by its ID.
    Parameters:
        - story_setting_id (int): The ID of the story setting to delete.
    Return
        - bool: True if the story setting was deleted, False if not found'''
    db_story_setting = get_story_setting_by_id(db, story_setting_id)
    if not db_story_setting:
        return False
    db.delete(db_story_setting)
    db.commit()
    return True