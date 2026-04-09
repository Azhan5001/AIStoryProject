from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AvatarCreate(BaseModel):
    '''
    Creating new avatar character.
    Used during character creation phase before the story begins.
    
    User provides avatar name and description; System generates avatar_id and timestamps automatically.
    '''
    avatar_name: str
    description: Optional[str] = None
    
class AvatarRead(BaseModel):
    '''
    Returning avatar information via API.
    Used when displaying avatar list/avatar details to users.
    '''
    avatar_id: int
    avatar_name: str
    description: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
    
 
class AvatarUpdate(BaseModel):
    '''
    Updating avatar information.
    Used when user wants to rename their avatar or update description.
    
    Optional.
    '''
    avatar_name: Optional[str] = None
    description: Optional[str] = None
    
    