@echo off
echo ========================================
echo   Starting Blogger Frontend Server
echo ========================================
echo.

:: Change to the frontend directory
cd /d "%~dp0frontend"

:: Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    echo Alternative: You can use any other HTTP server like:
    echo - Node.js: npx http-server -p 3000
    echo - PHP: php -S localhost:3000
    echo - Or any other local server
    echo.
    pause
    exit /b 1
)

:: Display Python version
echo Python detected:
python --version
echo.

:: Check if index.html exists
if not exist "index.html" (
    echo.
    echo ERROR: index.html not found in frontend directory!
    echo Please make sure you're in the correct directory.
    echo.
    pause
    exit /b 1
)

:: Start the HTTP server
echo Starting frontend server...
echo.
echo Frontend will be available at: http://localhost:3000
echo.
echo IMPORTANT: Make sure the backend server is also running!
echo Backend should be at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

:: Try Python 3 syntax first, then fallback to Python 2
python -m http.server 3000 2>nul
if errorlevel 1 (
    echo Trying Python 2 syntax...
    python -m SimpleHTTPServer 3000
)

:: If server stops, pause to show any error messages
echo.
echo Frontend server stopped.
pause
