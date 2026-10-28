@echo off
echo ========================================================
echo   Starting FoodVerse AI in Full Development Mode
echo ========================================================
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000
start cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Vite React Dev Server on http://localhost:5173
cd frontend
start cmd /k "npm run dev"
echo.
echo Both servers started! Open http://localhost:5173
