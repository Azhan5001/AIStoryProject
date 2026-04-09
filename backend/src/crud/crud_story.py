from sqlalchemy.orm import Session
from sqlmodel import select
from orm.story import Story
from typing import Optional, List

def get_stories(db: Session) -> List[Story]:
    '''Get all stories.
    Parameters:
        - None
    Return
        - list[Story]: list of story records from the database'''
    return db.exec(select(Story)).all()

def get_story_by_id(db: Session, story_id: int) -> Optional[Story]:
    '''Get a single story by its ID.
    
    Parameters:
        - None

    Return
        - Optional[Story]: story record from the database or None if not found'''
    return db.get(Story, story_id)

def get_stories_by_avatar_id(db: Session, avatar_id: int) -> List[Story]:
    '''Get stories by avatar ID.
    Parameters:
        - avatar_id (int): The ID of the avatar to filter stories.
    Return
        - list[Story]: list of story records from the database'''
    return db.get(Story, avatar_id)

def get_stories_by_user_id(db: Session, user_id: int) -> List[Story]:
    '''Get stories by user ID.
    Parameters:
        - user_id (int): The ID of the user to filter stories.
    Return
        - list[Story]: list of story records from the database'''
    statement = select(Story).where(Story.user_id == user_id)
    return db.exec(statement).all()

def get_stories_by_story_settings_id(db: Session, story_settings_id: int) -> List[Story]:
    '''Get stories by story settings ID.
    Parameters:
        - story_settings_id (int): The ID of the story settings to filter stories.
    Return
        - list[Story]: list of story records from the database'''
    return db.get(Story, story_settings_id)

def create_story(db: Session, story: Story) -> Story:
    '''Create a new story.
    Parameters:
        - story (Story): The story data to create.
    Return
        - Story: The created story record from the database'''
    db_story = Story.model_validate(story)
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

def update_story_by_id(db: Session, story_id: int, story: Story) -> Optional[Story]:
    '''Update a story by its ID.
    Parameters:
        - story_id (int): The ID of the story to update.
        - story (Story): The story data to update.
    Return
        - Optional[Story]: The updated story record from the database or None if not found'''
    db_story = get_story_by_id(db, story_id)
    if not db_story:
        return None
    for key, value in story.model_dump(exclude_unset=True).items():
        setattr(db_story, key, value)
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

def delete_story_by_id(db: Session, story_id: int) -> bool:
    '''Delete a story by its ID.
    Parameters:
        - story_id (int): The ID of the story to delete.
    Return
        - bool: True if the story was deleted, False if not found'''
    db_story = get_story_by_id(db, story_id)
    if not db_story:
        return False
    db.delete(db_story)
    db.commit()
    return True
