from fastapi import APIRouter, HTTPException, status
from routers import DbSession

from schemas import StorySettingCreate, StorySettingRead, StorySettingUpdate
from crud import crud_story_setting
from orm import StorySetting


story_setting_router = APIRouter(prefix="/{story_id}", tags=["Story Setting"])


# Create story setting
@story_setting_router.post("/setting/", response_model=StorySettingRead, status_code=status.HTTP_201_CREATED)
def create_story_setting(
    story_id: int,
    story_setting_data: StorySettingCreate,
    db: DbSession
):
    '''
    Create story setting configuration.
    '''
    story_setting = StorySetting(**story_setting_data.model_dump())
    created_story_setting = crud_story_setting.create_story_setting(db, story_setting)
    return created_story_setting


# Get story setting
@story_setting_router.get("/setting/{story_setting_id}", response_model=StorySettingRead)
def get_story_setting(
    story_id: int,
    story_setting_id: int,
    db: DbSession
):
    '''
    Retrieve a story setting by its ID.
    '''
    story_setting = crud_story_setting.get_story_setting_by_id(db, story_setting_id)
    if not story_setting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story setting with ID {story_setting_id} not found."
        )
    return story_setting


# Update story setting
@story_setting_router.put("/setting/{story_setting_id}", response_model=StorySettingRead, status_code=status.HTTP_200_OK)
def update_story_setting(
    story_id: int,
    story_setting_data: StorySettingUpdate,
    story_setting_id: int,
    db: DbSession
):
    '''
    Update an existing story setting.
    '''
    story_setting = crud_story_setting.get_story_setting_by_id(db, story_setting_id)
    if not story_setting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story setting with ID {story_setting_id} not found."
        )
    story_setting_update = StorySetting(**story_setting_data.model_dump())
    updated_story_setting = crud_story_setting.update_story_setting_by_id(db, story_setting_id, story_setting_update)
    return updated_story_setting
