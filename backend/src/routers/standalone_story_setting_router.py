from fastapi import APIRouter, HTTPException, status
from routers import DbSession

from schemas import StorySettingCreate, StorySettingRead
from crud import crud_story_setting
from orm import StorySetting


standalone_story_setting_router = APIRouter(tags=["Standalone Story Setting"])


# Create story setting without requiring story_id
@standalone_story_setting_router.post("/", response_model=StorySettingRead, status_code=status.HTTP_201_CREATED)
def create_standalone_story_setting(
    story_setting_data: StorySettingCreate,
    db: DbSession
):
    '''
    Create a new story setting independently (before story creation).
    '''
    story_setting = StorySetting(**story_setting_data.model_dump())
    created_story_setting = crud_story_setting.create_story_setting(db, story_setting)
    return created_story_setting


# Get story setting by ID
@standalone_story_setting_router.get("/{story_setting_id}", response_model=StorySettingRead)
def get_standalone_story_setting(
    story_setting_id: int,
    db: DbSession
):
    '''
    Retrieve a story setting by ID.
    '''
    story_setting = crud_story_setting.get_story_setting_by_id(db, story_setting_id)
    if not story_setting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story setting with ID {story_setting_id} not found."
        )
    return story_setting
