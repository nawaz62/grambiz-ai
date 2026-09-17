@echo off
echo ========================================================
echo   GRAMBIZ AI -- Smart India Hackathon 2026 (SIH26091)
echo   "Test Your Business Before You Invest."
echo ========================================================

echo Starting FastAPI Backend Server on http://127.0.0.1:8000 ...
start cmd /k "cd backend && python -m uvicorn app.main:app --port 8000 --reload"

echo Starting React Frontend Vite Server on http://localhost:3000 ...
start cmd /k "cd frontend && npm run dev"

echo Done! Open http://localhost:3000 in your browser.
pause
