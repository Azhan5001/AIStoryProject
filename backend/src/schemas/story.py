from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class StoryCreate(BaseModel):
    '''
    Creating a new story.
    '''
    user_id: int
    avatar_id: int
    story_setting_id: int
    
    
class StoryRead(BaseModel):
    '''
    Returning story information.
    Used when displaying story details or resuming a story session.
    '''
    story_id: int
    user_id: int
    avatar_id: int
    story_setting_id: int
    created_at: datetime
    
    class Config: 
        from_attributes = True
    