from fastapi import APIRouter, HTTPException, status
from routers import DbSession
from typing import List

from schemas.user import UserRead
from crud import crud_user

admin_router = APIRouter(tags=['Admin'])

@admin_router.get('/users', response_model=List[UserRead])
def list_users(db: DbSession):
	users = crud_user.get_users(db)
	return users

@admin_router.get('/users/{user_id}', response_model=UserRead)
def get_user(user_id: int, db: DbSession):
	user = crud_user.get_user_by_id(db, user_id)
	if not user:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f'User with id {user_id} not found.'
		)
	return user

@admin_router.delete('/users/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: DbSession):
	deleted = crud_user.delete_user_by_id(db, user_id)
	if not deleted:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f'User with id {user_id} not found.'
		)
