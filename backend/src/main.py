# Load Environment Variables (Note: Leave at the top as imports may use environment variables)
from dotenv import load_dotenv
from pathlib import Path

# Load .env from src/ directory (primary configuration)
src_env_path = Path(__file__).parent / '.env'
if src_env_path.exists():
    load_dotenv(dotenv_path=src_env_path, override=True)
else:
    # Fallback to project root .env
    env_path = Path(__file__).parent.parent / '.env'
    load_dotenv(dotenv_path=env_path, override=True)

from fastapi import Depends, FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from routers import get_db

from routers.avatar_router import avatar_router
from routers.message_router import message_router
from routers.story_router import story_router
from routers.story_setting_router import story_setting_router
from routers.standalone_avatar_router import standalone_avatar_router
from routers.standalone_story_setting_router import standalone_story_setting_router
from routers.auth_router import auth_router
from routers.admin_router import admin_router

# Local Imports
import database.database


router_dependencies = [Depends(get_db)]

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth endpoints
app.include_router(auth_router, prefix='/auth', dependencies=router_dependencies)

# Admin endpoints
app.include_router(admin_router, prefix='/admin', dependencies=router_dependencies)

# Standalone endpoints (no story_id required)
app.include_router(standalone_avatar_router, prefix='/avatar', dependencies=router_dependencies)
app.include_router(standalone_story_setting_router, prefix='/story-setting', dependencies=router_dependencies)

# Story-scoped endpoints
app.include_router(story_router, prefix='/story', dependencies=router_dependencies)
app.include_router(avatar_router, prefix='/story', dependencies=router_dependencies)
app.include_router(story_setting_router, prefix='/story', dependencies=router_dependencies)
app.include_router(message_router, prefix='/story', dependencies=router_dependencies)


# Note: Frontend mounting disabled - frontend runs separately via npm
# app.mount(
# 	'/frontend',
# 	StaticFiles(directory='frontend', html=True),
# 	name='frontend',
# )


@app.get("/", include_in_schema=False)
async def root():
	return {"message": "AI.R Taletoreum API - Backend running on port 8000"}


if __name__ == '__main__':
	import uvicorn
	uvicorn.run(app, host='0.0.0.0', port=8000)
