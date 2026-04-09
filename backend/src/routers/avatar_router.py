from fastapi import APIRouter, HTTPException, status
from routers import DbSession

from schemas import AvatarCreate, AvatarRead, AvatarUpdate
from crud import crud_avatar
from orm import Avatar


avatar_router = APIRouter(prefix="/{story_id}", tags=["Avatar"])


# Create avatar
@avatar_router.post("/avatar/", response_model=AvatarRead, status_code=status.HTTP_201_CREATED)
def create_avatar(
    story_id: int,
    avatar_data: AvatarCreate,
    db: DbSession
):
    '''
    Create a new avatar for the story.
    '''
    avatar = Avatar(**avatar_data.model_dump())
    created_avatar = crud_avatar.create_avatar(db, avatar)
    return created_avatar


# Get avatar
@avatar_router.get("/avatar/{avatar_id}", response_model=AvatarRead)
def get_avatar(
    story_id: int,
    avatar_id: int,
    db: DbSession
):
    '''
    Retrieve a single avatar by ID for the story.
    '''
    avatar = crud_avatar.get_avatar_by_id(db, avatar_id)
    if not avatar:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Avatar with id {avatar_id} not found."
        )
    return avatar


# Update avatar
@avatar_router.put("/avatar/{avatar_id}", response_model=AvatarRead, status_code=status.HTTP_200_OK)
def update_avatar(
    story_id: int,
    avatar_data: AvatarUpdate,
    avatar_id: int,
    db: DbSession
):
    '''
    Update an existing avatar for the story.
    '''
    avatar = crud_avatar.get_avatar_by_id(db, avatar_id)
    if not avatar:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Avatar with id {avatar_id} not found."
        )
    avatar_update = Avatar(**avatar_data.model_dump())
    updated_avatar = crud_avatar.update_avatar_by_id(db, avatar_id, avatar_update)
    return updated_avatar
