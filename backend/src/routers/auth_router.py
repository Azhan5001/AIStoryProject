from fastapi import APIRouter, HTTPException, status
from routers import DbSession
import bcrypt

from schemas.user import UserCreate, UserRead, UserLogin
from crud import crud_user
from orm.user import User

auth_router = APIRouter(tags=['Auth'])


def hash_password(password: str) -> str:
	return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
	return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


@auth_router.post('/register', response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: DbSession):
	existing = crud_user.get_user_by_username(db, user_data.username)
	if existing:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail='Username already taken.'
		)

	user = User(
		username=user_data.username,
		email=user_data.email,
		password=hash_password(user_data.password),
		access_level='user'
	)
	created_user = crud_user.create_user(db, user)
	return created_user


@auth_router.post('/login', response_model=UserRead)
def login(credentials: UserLogin, db: DbSession):
	user = crud_user.get_user_by_username(db, credentials.username)
	if not user or not verify_password(credentials.password, user.password):
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail='Invalid username or password.'
		)
	return user
