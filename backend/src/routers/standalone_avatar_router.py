from fastapi import APIRouter, HTTPException, status
from routers import DbSession

from schemas import AvatarCreate, AvatarRead
from crud import crud_avatar
from orm import Avatar


standalone_avatar_router = APIRouter(tags=["Standalone Avatar"])


# Create avatar without requiring story_id
@standalone_avatar_router.post("/", response_model=AvatarRead, status_code=status.HTTP_201_CREATED)
def create_standalone_avatar(
    avatar_data: AvatarCreate,
    db: DbSession
):
    '''
    Create a new avatar independently (before story creation).
    '''
    avatar = Avatar(**avatar_data.model_dump())
    created_avatar = crud_avatar.create_avatar(db, avatar)
    return created_avatar


# Get avatar by ID
@standalone_avatar_router.get("/{avatar_id}", response_model=AvatarRead)
def get_standalone_avatar(
    avatar_id: int,
    db: DbSession
):
    '''
    Retrieve an avatar by ID.
    '''
    avatar = crud_avatar.get_avatar_by_id(db, avatar_id)
    if not avatar:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Avatar with id {avatar_id} not found."
        )
    return avatar
