@echo off
echo ========================================
echo   Biotech Snap Newsletter Generator
echo ========================================
echo.

REM Check if data/latest-edition.json exists
if not exist "data\latest-edition.json" (
    echo ERROR: data\latest-edition.json not found!
    echo.
    echo Please create or copy your newsletter JSON file to:
    echo   data\latest-edition.json
    echo.
    pause
    exit /b 1
)

echo [1/3] Validating newsletter data...
node scripts\validate-json.js data\latest-edition.json
if errorlevel 1 (
    echo.
    echo Validation failed. Please fix errors above.
    pause
    exit /b 1
)

echo.
echo [2/3] Generating newsletter HTML...

REM Create editions folder if it doesn't exist
if not exist "editions" mkdir editions

REM Generate filename with date/time: newsletter_YYYYMMDD_HHMMSS.html
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,8%_%datetime:~8,6%
set output=editions\newsletter_%timestamp%.html

node scripts\generate-newsletter.js data\latest-edition.json templates\newsletter-template.html %output%

if errorlevel 1 (
    echo.
    echo Generation failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Done!
echo ========================================
echo   Newsletter generated successfully!
echo ========================================
echo.
echo Output file: %output%
echo.
echo You can now:
echo   - Open the HTML file in your browser to preview
echo   - Send it via your email platform
echo.
pause