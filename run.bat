@echo off
echo ========================================================
echo   Starting FoodVerse AI - Multimodal Intelligence Agent
echo ========================================================
echo Serving Frontend + FastAPI Backend at http://127.0.0.1:8000
echo Open your browser at http://127.0.0.1:8000
echo.
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
