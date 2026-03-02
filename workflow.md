# Project Workflow Guide

## Mentor Review Readiness

Team lead must update the project card with:

- Demo URL
- GitHub repository URL

Suggested message to team lead:

```text
Please update the project card with the final Demo URL and GitHub repository URL for mentor evaluation.
```

---

## Corrected Pre-requisites

- Python 3.10+
- Node.js 18+ (npm 9+)
- Git
- API keys for Groq, YouTube, Spoonacular, and Google Calendar

---

## Corrected Activity 1.1 - Create and activate virtual environment

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

---

## Corrected Activity 1.2 - Setup project folder structure

- `backend/` for FastAPI APIs, services, and DB scripts
- `frontend/` for React UI code

Expected core folders:

```text
backend/app
backend/scripts
frontend/src
```

---

## Corrected Activity 1.3 - Configure backend and frontend .env files

1. Copy examples:
   - `backend/.env.example -> backend/.env`
   - `frontend/.env.example -> frontend/.env`
2. Fill local values with your own credentials.
3. Never commit real secrets.

Backend required keys are in `backend/.env.example`.
Frontend required keys are in `frontend/.env.example`.

---

## Branch Naming

feature/<initials>/<short-description>

Examples:
- feature/dh/auth
- feature/aa/frontend
- feature/rd/setup

---

## Branch Strategy

main -> production ready  
develop -> integration branch  
feature branches -> individual work

Flow:
feature -> develop -> main

---

## Pull Request Rules

Every PR must include:

- Description of changes
- Related issue number
- Steps to run locally
- Testing steps
- Screenshots (if UI change)
- Update README or .env.example if needed

PR Size:
- Prefer small PRs (1-2 files)

---

## Code Review Ownership

| Area | Reviewer |
|------|---------|
| Backend APIs | Dhiraj |
| Frontend | Aditya |
| AI Services | Pankaj |
| DevOps / Setup | Rohit |

At least 1 approval required.

---

## Environment Variables

- Never commit real secrets
- Use `.env.example`
- Local `.env` ignored via `.gitignore`

---

## Deployment Flow (Planned)

1. Merge into develop
2. CI checks run
3. Manual testing
4. Merge to main
5. Deploy backend
6. Deploy frontend

---

## API Contract Usage

Frontend communicates only via REST APIs.

Authentication header:

Bearer <JWT_TOKEN>

---

## Definition of Done

- Code builds locally
- No secrets committed
- PR approved
- Tests/manual checks added
- Documentation updated

---

## Current Re-check Status

| Epic | Status |
|---|---|
| Epic 1: Environment Setup | Done |
| Epic 2: Backend API Development | Done |
| Epic 3: AI + External API Integration | Done (Calendar event sync endpoint active; requires valid Google OAuth access token) |
| Epic 4: React Frontend Development | Done |
| Epic 5: Testing and Deployment | In Progress (lint/build/compile checks passing) |
