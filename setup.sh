#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "[1/4] Ensuring project folders exist..."
mkdir -p backend/app backend/scripts frontend/src

echo "[2/4] Creating and activating backend virtual environment..."
if [ ! -d backend/.venv ]; then
  python3 -m venv backend/.venv
fi
source backend/.venv/bin/activate
python -m pip install --upgrade pip >/dev/null
pip install -r backend/requirements.txt
deactivate || true

echo "[3/4] Creating local .env files if missing..."
[ -f backend/.env ] || cp backend/.env.example backend/.env
[ -f frontend/.env ] || cp frontend/.env.example frontend/.env

echo "[4/4] Installing frontend dependencies..."
cd frontend
npm install --silent

echo "Setup complete."
echo "Backend: cd backend && source .venv/bin/activate && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
echo "Frontend: cd frontend && npm run dev"
