from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class ScenePropCreate(BaseModel):
    '''
    Create the prop according to the scene.
    '''
    scene_id: int
    prop_id: int
    
    
class ScenePropRead(BaseModel):
    '''
    Returning scene prop information.
    '''
    scene_prop_id: int
    scene_id: int
    prop_id: int
    created_at: datetime
    removed_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        
        