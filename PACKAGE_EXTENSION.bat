@echo off
REM A11YAssist - Package Extension Script
REM Authors: Sudha Rajendran and Rohitha Janga
REM Ontario Tech University

echo ====================================
echo   A11YAssist Extension Packager
echo ====================================
echo.

echo Step 1: Compiling TypeScript...
call npm run compile
if %errorlevel% neq 0 (
    echo ERROR: Compilation failed!
    pause
    exit /b 1
)
echo SUCCESS: Compilation complete!
echo.

echo Step 2: Packaging extension...
call npx vsce package
if %errorlevel% neq 0 (
    echo ERROR: Packaging failed!
    pause
    exit /b 1
)
echo SUCCESS: Extension packaged!
echo.

echo ====================================
echo   Package created successfully!
echo   File: a11yassist-1.0.0.vsix
echo ====================================
echo.
echo To install, run:
echo   code --install-extension a11yassist-1.0.0.vsix
echo.
pause
