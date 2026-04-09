from sqlalchemy.orm import Session
from sqlmodel import select
from orm.scene import Scene
from typing import Optional, List

def get_scenes(db: Session) -> List[Scene]:
    '''Get all scenes.
    Parameters:
        - None
    Return
        - list[Scene]: list of scene records from the database'''
    return db.exec(select(Scene)).all()

def get_scene_by_id(db: Session, scene_id: int) -> Optional[Scene]:
    '''Get a single scene by its ID.
    
    Parameters:
        - None

    Return
        - Optional[Scene]: scene record from the database or None if not found'''
    return db.get(Scene, scene_id)

def get_scenes_by_story_id(db: Session, story_id: int) -> List[Scene]:
    '''Get scenes by story ID.
    Parameters:
        - story_id (int): The ID of the story to filter scenes.
    Return
        - list[Scene]: list of scene records from the database'''
    return db.get(Scene, story_id)

def create_scene(db: Session, scene: Scene) -> Scene:
    '''Create a new scene.
    Parameters:
        - scene (Scene): The scene data to create.
    Return
        - Scene: The created scene record from the database'''
    db_scene = Scene.model_validate(scene)
    db.add(db_scene)
    db.commit()
    db.refresh(db_scene)
    return db_scene.model_dump()

def update_scene_by_id(db: Session, scene_id: int, scene: Scene) -> Optional[Scene]:
    '''Update a scene by its ID.
    Parameters:
        - scene_id (int): The ID of the scene to update.
        - scene (Scene): The scene data to update.
    Return
        - Optional[Scene]: The updated scene record from the database or None if not found'''
    db_scene = get_scene_by_id(db, scene_id)
    if not db_scene:
        return None
    for key, value in scene.model_dump(exclude_unset=True).items():
        setattr(db_scene, key, value)
    db.add(db_scene)
    db.commit()
    db.refresh(db_scene)
    return db_scene

def delete_scene_by_id(db: Session, scene_id: int) -> bool:
    '''Delete a scene by its ID.
    Parameters:
        - scene_id (int): The ID of the scene to delete.
    Return
        - bool: True if the scene was deleted, False if not found'''
    db_scene = get_scene_by_id(db, scene_id)
    if not db_scene:
        return False
    db.delete(db_scene)
    db.commit()
    return True
