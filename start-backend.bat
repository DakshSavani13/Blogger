@echo off
echo ========================================
echo    Starting Blogger Backend Server
echo ========================================
echo.

:: Change to the backend directory
cd /d "%~dp0backend"

:: Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo Please make sure Node.js and npm are installed.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
)

:: Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak >nul

:: Try to start MongoDB service if it's not running
net start MongoDB >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: Could not start MongoDB service automatically.
    echo Please make sure MongoDB is installed and running.
    echo.
    echo To start MongoDB manually:
    echo - Windows Service: net start MongoDB
    echo - Or start mongod.exe manually
    echo.
)

:: Check if .env file exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Creating default .env file...
    echo PORT=5000 > .env
    echo MONGODB_URI=mongodb://localhost:27017/blogger >> .env
    echo JWT_SECRET=your_jwt_secret_key_here_change_in_production >> .env
    echo NODE_ENV=development >> .env
    echo.
    echo Default .env file created. You may want to customize it.
    echo.
)

:: Run seed data if this is the first time
if not exist "seeded.flag" (
    echo.
    echo Setting up initial data...
    echo Running seed script...
    npm run seed
    if not errorlevel 1 (
        echo. > seeded.flag
        echo Initial data setup complete!
    )
    echo.
)

:: Start the server
echo.
echo Starting backend server...
echo Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm start

:: If server stops, pause to show any error messages
echo.
echo Server stopped.
pause
