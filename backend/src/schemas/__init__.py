"""
Pydantic schemas for API request/response validation.
Defines the contract between API endpoints and clients.
"""

from .user import UserCreate, UserRead, UserUpdate
from .avatar import AvatarCreate, AvatarRead, AvatarUpdate
from .story_setting import StorySettingCreate, StorySettingRead, StorySettingUpdate
from .story import StoryCreate, StoryRead
from .scene import SceneCreate, SceneRead, SceneUpdate
from .prop import PropCreate, PropRead, PropUpdate
from .scene_prop import ScenePropCreate, ScenePropRead
from .message import MessageCreate, MessageRead, MessageUpdate, Role, Message, Conversation
from .story_generation import StoryAvatar, StoryEvaluation, StoryMessage, StoryContext, MissingElementsInfo


__all__ = ["UserCreate", "UserRead", "UserUpdate", "AvatarCreate", "AvatarRead", "AvatarUpdate", "StorySettingCreate", "StorySettingRead", "StorySettingUpdate", "StoryCreate", "StoryRead", "SceneCreate", "SceneRead", "SceneUpdate", "PropCreate", "PropRead", "PropUpdate", "ScenePropCreate", "ScenePropRead", "MessageCreate", "MessageRead", "MessageUpdate", "Role", "Message", "Conversation", "StoryAvatar", "StoryEvaluation", "StoryMessage", "StoryContext", "MissingElementsInfo"]

