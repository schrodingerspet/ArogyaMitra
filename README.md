# ArogyaMitra

AI-driven workout planning, nutrition guidance, and health coaching platform.

## Mentor Review Links (Team Lead Action Required)

Before mentor evaluation, please ask the team lead to update:

- Demo URL: `ADD_DEMO_LINK_HERE`
- GitHub Repository URL: `ADD_GITHUB_LINK_HERE`

Use this copy-paste request:

```text
Hi Team Lead, please update the project card links for mentor review:
1) Demo URL: <paste deployed demo link>
2) GitHub URL: <paste repository link>
```

## Activity Completion Check (Re-verified)

| Activity Group | Status | Notes |
|---|---|---|
| Epic 1 (1.1-1.5) Setup | Done | `.env.example` files are present and setup script paths are valid. |
| Epic 2 (2.1-2.4) Backend | Done | Auth, routers, models, and service-layer modules are implemented. |
| Epic 3 (3.1-3.5) Integrations | Done | Groq, YouTube, Spoonacular, and Calendar event sync endpoint implemented. |
| Epic 4 (4.1-4.4) Frontend | Done | Dashboard, feature pages, AROMI assistant, and Zustand stores are in place. |
| Epic 5 (5.1-5.4) Testing | In Progress | Current validation uses lint/build/compile checks; full automated suites can be extended. |

## Project Overview

ArogyaMitra provides:

- Personalized 7-day workout plans
- Nutrition guidance based on goals and restrictions
- Real-time AI coaching support (AROMI)
- Progress and wellness tracking

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Python
- Frontend: React + Vite
- Database (current default): SQLite
- AI/External APIs: Groq, YouTube Data API, Spoonacular, Google Calendar

## Corrected Pre-requisites

- Python `3.10+`
- Node.js `18+`
- npm `9+`
- Git

> Note: The current repository uses SQLite by default (`DATABASE_URL=sqlite:///./arogya.db`), so PostgreSQL is optional, not mandatory.

## Project Structure (Activity 1.2)

```text
ArogyaMitra/
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── scripts/
│   │   └── init_db.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
└── workflow.md
```

## Setup Guide

### Activity 1.1: Create and activate virtual environment

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
```

### Install backend dependencies

```bash
pip install -r requirements.txt
```

### Activity 1.3: Configure environment files securely

Backend:

```bash
cp .env.example .env
```

Frontend:

```bash
cd ../frontend
cp .env.example .env
```

Update values in both `.env` files with your own credentials. Do not commit real API keys.

### Install frontend dependencies

```bash
npm install
```

## Run the Application

Backend (terminal 1):

```bash
cd backend
source .venv/bin/activate   # Windows: .venv\Scripts\activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Frontend (terminal 2):

```bash
cd frontend
npm run dev
```

## Verification

- Backend health: `http://127.0.0.1:8000/health`
- Backend docs: `http://127.0.0.1:8000/docs`
- Frontend: `http://127.0.0.1:5173`

## Security Notes

- Never commit `.env` files.
- Keep `.env.example` with placeholders only.
- Rotate any secret immediately if it was ever exposed publicly.
