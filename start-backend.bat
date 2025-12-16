@echo off
echo ========================================
echo  ContextType - Starting Backend
echo ========================================
echo.

cd backend

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Checking for .env file...
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit backend\.env and add your Groq API key!
    echo Get your key from: https://console.groq.com
    echo.
    pause
)

echo.
echo Starting backend server...
echo Backend will run on http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm start
