from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    '''
    Creating a new user account.
    Used when registering a new user in the system.
    '''
    username: str
    email: EmailStr
    password: str
    
class UserRead(BaseModel):
    '''
    Returning user for information via API.
    '''
    user_id: int
    username: str
    email: str
    access_level: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    '''
    Login credentials.
    '''
    username: str
    password: str
    

class UserUpdate(BaseModel):
    '''
    Updating user account information.
    Used when user edits their account.
    
    Optional.
    '''
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    