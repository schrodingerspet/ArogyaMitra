<div align="center">

<img src="logo.png" alt="ArogyaMitra Logo" width="120" />

# ArogyaMitra

**AI-Driven Workout Planning, Nutrition Guidance & Health Coaching**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.133-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [API Docs](#-api-documentation) · [Team](#-team)

</div>

---

ArogyaMitra is a full-stack wellness platform that generates **personalized 7-day workout plans**, **allergy-aware Indian-cuisine meal plans**, and provides **real-time adaptive AI coaching** through its conversational agent **AROMI** — all powered by Groq LLaMA-3.3-70B.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏋️ **AI Workout Plans** | Personalized 7-day plans based on your fitness level, goals, equipment, and available time |
| 🍛 **Indian Meal Plans** | Allergy-aware nutrition plans with 40+ Indian recipes, full macro breakdowns & cooking instructions |
| 🤖 **AROMI AI Coach** | Adaptive chatbot that adjusts your plan for travel, injuries, mood — via natural conversation |
| �� **Progress Analytics** | Track weight, calories, streaks & trends with interactive charts |
| 🎥 **YouTube Videos** | Exercise tutorials embedded directly in your workout plan |
| 📅 **Calendar Sync** | Push workout sessions to Google Calendar with one click |
| 🏆 **Gamified Charity** | Fitness streaks linked to social impact metrics |
| 🔐 **Secure Auth** | JWT + bcrypt authentication with Pydantic-validated endpoints |

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Zustand, Framer Motion, React Hook Form, React Query |
| **Backend** | FastAPI 0.133, Python 3.10+, Uvicorn, SQLAlchemy 2.0, Pydantic 2.12 |
| **AI Engine** | Groq LLaMA-3.3-70B Versatile (70B params, ~200 tokens/sec on LPU hardware) |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **External APIs** | YouTube Data API v3, Spoonacular Food API, Google Calendar API |

## 📁 Project Structure

```
ArogyaMitra/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, router registration
│   │   ├── config.py            # JWT settings
│   │   ├── database.py          # SQLAlchemy engine & session
│   │   ├── models.py            # 9 ORM models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth/                # JWT + bcrypt auth module
│   │   ├── routers/             # 10 API routers
│   │   └── services/            # 8 service modules (Groq, YouTube, etc.)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios instances with JWT interceptors
│   │   ├── components/          # AromiChat, Layout, Sidebar, UI kit
│   │   ├── pages/               # Dashboard, Workouts, Nutrition, etc.
│   │   ├── stores/              # 9 Zustand stores
│   │   ├── hooks/               # Custom React hooks
│   │   └── lib/                 # React Query config, design tokens
│   ├── package.json
│   └── .env.example
├── setup.sh                     # One-command project setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** (npm 9+)
- **Git**

> SQLite is used by default — no database setup needed.

### 1. Clone & Setup

```bash
git clone https://github.com/schrodingerspet/ArogyaMitra.git
cd ArogyaMitra
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Then fill in your API keys
```

### 3. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

### 4. Run

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend && source venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

```bash
# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 5. Verify

| URL | What |
|-----|------|
| http://localhost:5173 | Frontend app |
| http://127.0.0.1:8000/docs | Swagger API docs |
| http://127.0.0.1:8000/health-check | Health check |

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=sqlite:///./arogya.db
SECRET_KEY=your-32-char-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

GROQ_API_KEY=gsk_...                  # https://console.groq.com/keys
YOUTUBE_API_KEY=AIza...               # Google Cloud Console
SPOONACULAR_API_KEY=your_key          # https://spoonacular.com/food-api/console
GOOGLE_CALENDAR_CLIENT_ID=your_id     # Google Cloud Console
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ Never commit `.env` files. The `.env.example` files contain safe placeholders.

## 📡 API Documentation

**10 routers · 46+ endpoints** — all documented at `/docs` (Swagger UI).

| Router | Path | Endpoints | Description |
|--------|------|-----------|-------------|
| Auth | `/auth` | 5 | Register, login, profile CRUD |
| Workouts | `/workouts` | 7 | AI & template plan generation |
| Nutrition | `/nutrition` | 7 | Meal plan generation with allergy filter |
| Chat | `/chat` | 6 | AROMI sessions, messages, actions |
| Health | `/health` | 5 | Assessments, BMI/BMR/TDEE |
| Progress | `/progress` | 4 | Daily metric logging |
| Analytics | `/analytics` | 4 | Summaries, streaks, trends |
| Calendar | `/calendar` | 3 | Google Calendar sync |
| Admin | `/admin` | 3 | Admin operations |
| Protected | `/protected` | 2 | Auth test routes |

## 🤖 AROMI — Your AI Coach

AROMI is a context-aware conversational AI that lives as a floating chat widget on every page.

**What it can do:**
- Generate personalized workout & meal plans from conversation
- Adapt plans when you're traveling, injured, or tired
- Answer fitness & nutrition questions with your health profile in context
- Trigger backend actions (plan generation, calendar sync) from natural language

**Example:**
```
You:   "I'm traveling for 4 days, no gym"
AROMI: "Here's your travel plan — Day 1: Hotel HIIT, Day 2: Walk + Stretch..."
```

## 🧪 Testing

```bash
# Backend — run from backend/
pytest

# Frontend — lint
cd frontend && npm run lint

# Frontend — E2E (Cypress)
cd frontend && npm run cypress:open
```

## 👥 Team

| Name | Role |
|------|------|
| **Pankaj Bhoge** | Team Lead — AI integration, AROMI, service architecture |
| **Rohit Dake** | Developer — YouTube & Spoonacular APIs, environment setup |
| **Dhiraj Dattaray Holkar** | Developer — JWT auth, routers, Zustand stores, AROMI frontend |
| **Aditya Akolkar** | Developer — ORM models, Calendar API, all frontend pages |

## 📄 License

This project is built for educational purposes.

---

<div align="center">
<sub>Built with ❤️ using FastAPI + React + Groq LLaMA-3.3-70B</sub>
</div>
