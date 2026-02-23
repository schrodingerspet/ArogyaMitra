# Project Workflow Guide

## Branch Naming

feature/<initials>/<short-description>

Examples:
- feature/dh/auth
- feature/aa/frontend
- feature/rd/setup

---

## Branch Strategy

main → production ready  
develop → integration branch  
feature branches → individual work

Flow:
feature → develop → main

---

## Pull Request Rules

Every PR must include:

- Description of changes
- Related Issue number
- Steps to run locally
- Testing steps
- Screenshots (if UI change)
- Update README or .env.example if needed

PR Size:
- Prefer small PRs (1–2 files)

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

Authentication:
Authorization Header:

Bearer <JWT_TOKEN>

---

## Definition of Done

- Code builds locally
- No secrets committed
- PR approved
- Tests/manual checks added
- Documentation updated