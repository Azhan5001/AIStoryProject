# Imports
import os
from sqlmodel import SQLModel, create_engine



### Model Definitions ###

from orm import User, Story, StorySetting, Avatar, Prop, SceneProp, Scene, Message

### Model Definitions End ###



# Create database engine
DATABASE_URL = f'{os.getenv('DATABASE_DRIVER')}:///{os.getenv('DATABASE_URL')}' # SQLite



# SQLModel
print('[INFO] Creating database tables')
engine = create_engine(DATABASE_URL, echo=True)
# TODO: check how SQLModel behaves when creating all on an existing database when schema changes
SQLModel.metadata.create_all(engine)
print('[INFO] Created database tables')