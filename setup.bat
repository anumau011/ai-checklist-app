@echo off
REM Setup script for AI Checklist App (Windows)

echo 🚀 AI Checklist App - Setup Script
echo ==================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd backend
if not exist .env (
    copy .env.example .env
    echo Created backend\.env - Please edit with your credentials
)
call npm install

echo.
echo ⚠️  IMPORTANT - Backend Configuration:
echo   Edit backend\.env and add:
echo   - MONGODB_URI: MongoDB connection string
echo   - JWT_SECRET: Random secret key
echo   - GEMINI_API_KEY: Google Gemini API key
echo.
echo   Get Gemini API key from: https://makersuite.google.com/app/apikey
echo.

REM Setup Frontend
echo 📦 Setting up Frontend...
cd ..\frontend
if not exist .env (
    copy .env.example .env
)
call npm install

echo.
echo ✅ Setup complete!
echo.
echo 📚 Next Steps:
echo   1. Edit backend\.env with your credentials
echo   2. Start MongoDB (mongod or Docker)
echo   3. Run: npm run dev (from backend directory)
echo   4. Run: npm run dev (from frontend directory)
echo   5. Visit: http://localhost:5173
echo.
echo 📖 For more details, see QUICKSTART.md
