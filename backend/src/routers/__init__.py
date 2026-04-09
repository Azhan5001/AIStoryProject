from sqlmodel import Session
from fastapi import Depends
from typing import Annotated
from database.database import engine

def get_db():
    '''
    Dependency to provide database session
    '''
    with Session(engine) as session:
        yield session
        
DbSession = Annotated[Session, Depends(get_db)]
