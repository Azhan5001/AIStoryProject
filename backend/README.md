# AI.R Taletorium

Repository for the AI.R Taletorium project.

Full documentation can be found [here](docs/README.md).

Quickstart:
1. Install `uv` https://docs.astral.sh/uv/getting-started/installation/
2. Synchronize dependencies: `uv sync`
3. Copy and configure environment variables: `cp .env.example src/.env`
4. Select Python interpreter in `.venv`
5. Change directory to `src`: `cd src`
6. Seed the database with dummy data (optional): `uv run python seed.py`
7. Run FastAPI backend: `uv run fastapi dev main.py`, this sets up the backend and the database on your local machine.

Seed credentials:
- Regular user: `alice` / `password123`
- Admin user: `admin` / `admin123`
