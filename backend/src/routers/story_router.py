from fastapi import APIRouter, HTTPException, status
from routers import DbSession
from typing import List, Optional

from schemas import StoryCreate, StoryRead
from crud import crud_story
from orm import Story


story_router = APIRouter(tags=['Story'])

# === Story Endpoint ===

# List Stories
@story_router.get("/", response_model=List[StoryRead])
def list_stories(db: DbSession, user_id: Optional[int] = None):
    '''
    Get all stories, optionally filtered by user_id.
    '''
    if user_id:
        stories = crud_story.get_stories_by_user_id(db, user_id)
    else:
        stories = crud_story.get_stories(db)
    return stories


# Create Story (Clear/Reset)
@story_router.post("/", response_model=StoryRead, status_code=status.HTTP_201_CREATED)
def create_story(
    story_data: StoryCreate,
    db: DbSession
):
    '''
    Create a new story.
    '''
    story = Story(**story_data.model_dump())
    created_story = crud_story.create_story(db, story)
    return created_story


# Get Story
@story_router.get("/{story_id}", response_model=StoryRead)
def get_story(
    story_id: int,
    db: DbSession
):
    '''
    Get a specific story by ID
    '''
    story = crud_story.get_story_by_id(db, story_id)
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story with id {story_id} not found."
        )
    return story

