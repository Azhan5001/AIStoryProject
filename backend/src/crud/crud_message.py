from sqlalchemy.orm import Session
from sqlmodel import select
from orm.message import Message
from typing import Optional, List

def get_messages(db: Session) -> List[Message]:
    '''Get all messages.
    Parameters:
        - None
    Return
        - list[Message]: list of message records from the database'''
    return db.exec(select(Message)).all()

def get_message_by_id(db: Session, message_id: int) -> Optional[Message]:
    '''Get a single message by its ID.
    
    Parameters:
        - None

    Return
        - Optional[Message]: message record from the database or None if not found'''
    return db.get(Message, message_id)

def get_messages_by_story_id(db: Session, story_id: int) -> List[Message]:
    '''Get messages by story ID.
    Parameters:
        - story_id (int): The ID of the story to filter messages.
    Return
        - list[Message]: list of message records from the database'''
    return db.exec(select(Message).where(Message.story_id == story_id)).all()

def get_messages_by_scene_id(db: Session, scene_id: int) -> List[Message]:
    '''Get messages by scene ID.
    Parameters:
        - scene_id (int): The ID of the scene to filter messages.
    Return
        - list[Message]: list of message records from the database'''
    return db.exec(select(Message).where(Message.scene_id == scene_id)).all()

def create_message(db: Session, message: Message) -> Message:
    '''Create a new message.
    Parameters:
        - message (Message): The message data to create.
    Return
        - Message: The created message record from the database'''
    db_message = Message.model_validate(message)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def update_message_by_id(db: Session, message_id: int, message: Message) -> Optional[Message]:
    '''Update a message by its ID.
    Parameters:
        - message_id (int): The ID of the message to update.
        - message (Message): The message data to update.
    Return
        - Optional[Message]: The updated message record from the database or None if not found'''
    db_message = get_message_by_id(db, message_id)
    if not db_message:
        return None
    for key, value in message.model_dump(exclude_unset=True).items():
        setattr(db_message, key, value)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def delete_message_by_id(db: Session, message_id: int) -> bool:
    '''Delete a message by its ID.
    Parameters:
        - message_id (int): The ID of the message to delete.
    Return
        - bool: True if the message was deleted, False if not found'''
    db_message = get_message_by_id(db, message_id)
    if not db_message:
        return False
    db.delete(db_message)
    db.commit()
    return True