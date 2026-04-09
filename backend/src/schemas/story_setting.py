from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class StorySettingCreate(BaseModel):
    '''
    Creating a story setting/prompt.
    '''
    setting_prompt: str
    
class StorySettingRead(BaseModel):
    '''
    Returning story setting information.
    Used when displaying story configuration/setting details.
    '''
    story_setting_id: int
    setting_prompt: str
    created_at: datetime
    
    class Config:
        from_attributes = True    
        
class StorySettingUpdate(BaseModel):
    '''
    Updating story setting information.
    Used when user wants to modify the story premise/setting.
    
    Optional
    '''
    setting_prompt: Optional[str] = None
    