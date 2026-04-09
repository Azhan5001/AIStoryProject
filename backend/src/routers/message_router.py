from fastapi import APIRouter, HTTPException, status
from routers import DbSession
from typing import List

from schemas import MessageCreate, MessageRead, MessageUpdate
from schemas.message import Role
from crud import crud_message, crud_story, crud_avatar, crud_story_setting
from orm import Message

# Try to import story generation - it's optional
try:
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    import story_generation
    from schemas.story_generation import StoryAvatar, StoryMessage
    STORY_GENERATION_AVAILABLE = True
except Exception as e:
    print(f"[WARNING] Story generation not available: {e}")
    print("[INFO] Install required packages: pip install openai python-dotenv")
    STORY_GENERATION_AVAILABLE = False


message_router = APIRouter(prefix="/{story_id}", tags=["Message"])


# Get messages
@message_router.get("/message/", response_model=List[MessageRead])
def get_messages(
    story_id: int,
    db: DbSession
):
    '''
    Get all messages for a story.
    '''
    messages = crud_message.get_messages_by_story_id(db, story_id)
    return messages


# Send message
@message_router.post("/message/", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
def create_message(
    story_id: int,
    message_data: MessageCreate,
    db: DbSession
):
    '''
    Create a new message in the story and generate AI response if user message.
    '''
    print(f"[DEBUG] Received message: role={message_data.role}, content={message_data.content[:50]}...")
    
    # Create user message
    message = Message(**message_data.model_dump())
    message.story_id = story_id
    created_message = crud_message.create_message(db, message)
    print(f"[DEBUG] Created message ID: {created_message.message_id}")
    
    # If this is a user message, generate AI response
    if message_data.role == Role.user_messages and STORY_GENERATION_AVAILABLE:
        print(f"[DEBUG] Generating AI response... (story_id={story_id})")
        try:
            # Fetch story context
            story = crud_story.get_story_by_id(db, story_id)
            if not story:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Story with ID {story_id} not found."
                )
            
            # Fetch avatar and story setting
            avatar = crud_avatar.get_avatar_by_id(db, story.avatar_id)
            setting = crud_story_setting.get_story_setting_by_id(db, story.story_setting_id)
            
            if not avatar or not setting:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Avatar or story setting not found."
                )
            
            # Get message history
            history_messages = crud_message.get_messages_by_story_id(db, story_id)
            
            # Convert to StoryAvatar (ORM uses avatar_name, schema uses name)
            story_avatar = StoryAvatar(
                name=avatar.avatar_name,
                description=avatar.description or "",
            )
            
            current_direction = getattr(story, 'current_direction', '') or ''
            
            # Check if this is the first message (only the user message we just created)
            if len(history_messages) <= 1:
                print(f"[DEBUG] First message — calling initialize_story with avatar={avatar.avatar_name}, setting={setting.setting_prompt[:50]}...")
                
                new_messages = story_generation.initialize_story(
                    avatar=story_avatar,
                    story_setting=setting.setting_prompt,
                )
                
                # Extract direction from metadata
                new_direction = current_direction
                for msg in new_messages:
                    if msg.metadata and msg.metadata.get("type") == "narrative_direction":
                        new_direction = msg.metadata.get("selected", current_direction)
                if not new_direction:
                    new_direction = next(
                        (msg.narrative_direction for msg in reversed(new_messages) if msg.role == Role.assistant),
                        current_direction,
                    )
            else:
                print(f"[DEBUG] Subsequent message — calling advance_story with avatar={avatar.avatar_name}, setting={setting.setting_prompt[:50]}...")
                
                # Convert history to StoryMessage format
                history = [
                    StoryMessage(
                        content=msg.content,
                        role=Role(msg.role),
                        narrative_direction=getattr(msg, 'narrative_direction', ''),
                    )
                    for msg in history_messages
                ]
                
                new_messages, new_direction = story_generation.advance_story(
                    avatar=story_avatar,
                    story_setting=setting.setting_prompt,
                    current_direction=current_direction,
                    history=history,
                    user_input=message_data.content,
                )
            
            print(f"[DEBUG] AI generated {len(new_messages)} messages, new direction: {new_direction[:50] if new_direction else 'None'}...")
            
            # Update story direction
            story.current_direction = new_direction
            db.add(story)
            db.commit()
            
            # Save AI-generated messages to database
            for story_msg in new_messages:
                # Skip metadata messages (they're internal)
                if story_msg.role == Role.metadata:
                    continue
                    
                ai_message = Message(
                    story_id=story_id,
                    content=story_msg.content,
                    role=story_msg.role.value,
                )
                created_ai_msg = crud_message.create_message(db, ai_message)
                print(f"[DEBUG] Saved AI message ID: {created_ai_msg.message_id}, role: {story_msg.role}")
                
        except Exception as e:
            print(f"[ERROR] Error generating AI response: {e}")
            import traceback
            traceback.print_exc()
    
    return created_message


# Update message
@message_router.put("/message/{message_id}", response_model=MessageRead, status_code=status.HTTP_200_OK)
def update_message(
    story_id: int,
    message_id: int,
    message_data: MessageUpdate,
    db: DbSession
):
    '''
    Update a message.
    '''
    updated_message = crud_message.update_message_by_id(db, message_id, message_data)
    if not updated_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Message with id {message_id} not found."
        )
    return updated_message


# Delete message
@message_router.delete("/message/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    story_id: int,
    message_id: int,
    db: DbSession
):
    '''
    Delete a message.
    '''
    success = crud_message.delete_message_by_id(db, message_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Message with id {message_id} not found."
        )