from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class SceneCreate(BaseModel):
    '''
    Creating a new scene.
    '''
    story_id: int
    scene_name: str
    scene_description: str
    scene_graph: str # stored as JSON/string ?
    
    
class SceneRead(BaseModel):
    '''
    Returning scene information.
    Used when displaying current scene state or scene history.
    '''
    scene_id: int
    story_id: int
    scene_name: str
    scene_description: str
    scene_graph: str
    created_at: datetime
    
    class Config:
        from_attributes = True
        
        
class SceneUpdate(BaseModel):
    '''
    Updating scene information when needed.
    
    Optional.
    '''
    scene_name: Optional[str] = None
    scene_description: Optional[str] = None
    scene_graph: Optional[str] = None
    
    
    