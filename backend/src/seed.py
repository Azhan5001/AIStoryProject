"""
Seed script to populate the database with dummy data for development.
Run: uv run python seed.py
"""

from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent / '.env'
if env_path.exists():
	load_dotenv(dotenv_path=env_path, override=True)
else:
	env_path = Path(__file__).parent.parent / '.env'
	load_dotenv(dotenv_path=env_path, override=True)

from sqlmodel import Session
import bcrypt

from database.database import engine
from orm.user import User
from orm.avatar import Avatar
from orm.story_setting import StorySetting
from orm.story import Story
from orm.message import Message, Role


def hash_password(password: str) -> str:
	return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def seed():
	with Session(engine) as db:
		# Users
		user = User(
			username='alice',
			email='alice@example.com',
			password=hash_password('password123'),
			access_level='user',
		)
		admin = User(
			username='admin',
			email='admin@example.com',
			password=hash_password('admin123'),
			access_level='admin',
		)
		db.add(user)
		db.add(admin)
		db.commit()
		db.refresh(user)
		db.refresh(admin)
		print(f'Users created: {user.username} (id={user.user_id}), {admin.username} (id={admin.user_id})')

		# Avatars
		avatar1 = Avatar(
			avatar_name='Luna',
			description='A curious young explorer with silver hair and a magical compass that always points toward adventure.',
		)
		avatar2 = Avatar(
			avatar_name='Bramble',
			description='A friendly talking fox with a bushy tail and a knack for finding hidden paths through enchanted forests.',
		)
		db.add(avatar1)
		db.add(avatar2)
		db.commit()
		db.refresh(avatar1)
		db.refresh(avatar2)
		print(f'Avatars created: {avatar1.avatar_name} (id={avatar1.avatar_id}), {avatar2.avatar_name} (id={avatar2.avatar_id})')

		# Story Settings
		setting1 = StorySetting(
			setting_prompt='A magical kingdom hidden in the clouds where castles float on giant lily pads and rainbows serve as bridges between islands.',
		)
		setting2 = StorySetting(
			setting_prompt='An underwater city made of coral and crystal, where merfolk and sea creatures live in harmony and guard ancient ocean secrets.',
		)
		db.add(setting1)
		db.add(setting2)
		db.commit()
		db.refresh(setting1)
		db.refresh(setting2)
		print(f'Story settings created: id={setting1.story_setting_id}, id={setting2.story_setting_id}')

		# Stories
		story1 = Story(
			user_id=user.user_id,
			avatar_id=avatar1.avatar_id,
			story_setting_id=setting1.story_setting_id,
			current_direction='Luna discovers a hidden garden at the edge of the cloud kingdom',
		)
		story2 = Story(
			user_id=user.user_id,
			avatar_id=avatar2.avatar_id,
			story_setting_id=setting2.story_setting_id,
			current_direction='Bramble searches for the lost pearl of the ocean king',
		)
		db.add(story1)
		db.add(story2)
		db.commit()
		db.refresh(story1)
		db.refresh(story2)
		print(f'Stories created: id={story1.story_id}, id={story2.story_id}')

		# Messages for story 1 (a short conversation)
		messages = [
			Message(
				story_id=story1.story_id,
				content='Once upon a time, high above the world where the clouds grew thick as cotton candy, there existed a kingdom that no ordinary eye could see. Luna stood at the edge of the Moonbeam Bridge, her silver compass spinning wildly in her palm. "Something extraordinary lies ahead," she whispered, watching the needle settle toward a garden of luminous flowers she had never noticed before.',
				role=Role.assistant,
			),
			Message(
				story_id=story1.story_id,
				content='Luna walks toward the glowing flowers',
				role=Role.user_messages,
			),
			Message(
				story_id=story1.story_id,
				content='As Luna stepped closer, the flowers began to hum a gentle melody, their petals opening wider with each of her footsteps. The garden was alive in ways she had never imagined. Tiny sprites made of starlight flitted between the stems, tending to blooms that shimmered in every colour of the sunset. One sprite, no bigger than her thumb, flew up to her nose and giggled. "Welcome, Luna! We have been waiting for someone brave enough to find us."',
				role=Role.assistant,
			),
		]
		for msg in messages:
			db.add(msg)
		db.commit()
		print(f'Messages created: {len(messages)} messages for story {story1.story_id}')

	print('\nSeed complete!')
	print('Login credentials:')
	print('  Regular user  ->  username: alice, password: password123')
	print('  Admin user    ->  username: admin, password: admin123')


if __name__ == '__main__':
	seed()
