# Overview

This project consists of a frontend and backend application. For convenience, both services can be started together from the project root directory using a single command.

**Important:** The frontend was the primary scope of this project. The backend was developed by client and is included only to support evaluation and testing of the complete system.

---

# Running Frontend and Backend Together (Recommended)

After completing the setup steps from below for both frontend and backend:

1. Open a terminal in the project root folder.
2. Run:

```bash
npm run dev
```

This command uses Concurrently to start both the frontend and backend servers at the same time.

---

# Frontend Setup and Run

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend should now be accessible through the local development URL displayed in the terminal.

---

# Backend Setup and Run

> Note: The backend was not part of our project scope. The following instructions are provided to assist evaluators in running the complete system.

## 1. Navigate to the backend folder

```bash
cd backend
```

## 2. Create a Python virtual environment

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## 3. Install required tools

Install UV:

```bash
pip install uv
```

Install Ruff:

```bash
pip install ruff
```

## 4. Install project requirements

If a requirements file is provided:

```bash
pip install -r requirements.txt
```

Alternatively:

```bash
uv pip install -r requirements.txt
```

## 5. Configure Environment Variables

A `.env` file is required for the backend to run correctly.

If the `.env` file is not automatically created during setup, create it manually in the backend directory and populate it with the required environment variables.

## 6. Start the Backend Server

Run:

```bash
fastapi dev main.py
```

If the above command does not work, use:

```bash
uvicorn main:app --reload
```

The backend API should now be running locally.

---

# Running Frontend Only

1. Open a terminal in the frontend folder:

```bash
cd frontend
```

2. Start the frontend:

```bash
npm run dev
```

---

# Running Backend Only

1. Open a terminal in the backend folder.
2. Activate the virtual environment.
3. Start the backend:

```bash
fastapi dev main.py
```

or

```bash
uvicorn main:app --reload
```
