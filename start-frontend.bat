@echo off
echo ========================================
echo  ContextType - Starting Frontend
echo ========================================
echo.

cd frontend

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting frontend dev server...
echo Open http://localhost:5173 in your browser
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
