from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class PropCreate(BaseModel):
    '''
    Creating a new prop object.
    Used in scene construction and prop catalog management.
    '''
    avatar_id: Optional[int] = None
    prop_description: str
    prop_category: str
    prop_state: str
    resource_path: str
    
    
class PropRead(BaseModel):
    '''
    Returning prop information.
    Used when displaying scene props/prop catalog.
    '''
    prop_id: int
    avatar_id: Optional[int] = None
    prop_description: str
    prop_category: str
    prop_state: str
    resource_path: str
    created_at: datetime
    deleted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
    

class PropUpdate(BaseModel):
    '''
    Updating the prop information.
    Used when modifying prop attributes or state.
    
    Optional.
    '''
    prop_description: Optional[str] = None
    prop_category: Optional[str] = None
    prop_state: Optional[str] = None
    resource_path: Optional[str] = None