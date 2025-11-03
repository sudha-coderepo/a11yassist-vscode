# A11YAssist - Package and Install Script
# Authors: Sudha Rajendran and Rohitha Janga
# Institution: Ontario Tech University
# GitHub: https://github.com/jangarohitha94/a11yassist-vscode

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  A11YAssist - Package and Install" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Compile
Write-Host "Step 1: Compiling TypeScript..." -ForegroundColor Yellow
npm run compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Compilation failed!" -ForegroundColor Red
    Write-Host "Fix the errors and try again." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "SUCCESS: Compilation complete!" -ForegroundColor Green
Write-Host ""

# Step 2: Lint
Write-Host "Step 2: Checking code quality..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Linting found issues." -ForegroundColor Yellow
    Write-Host "Run 'npm run lint:fix' to auto-fix issues." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}
Write-Host "Code quality check complete!" -ForegroundColor Green
Write-Host ""

# Step 3: Package
Write-Host "Step 3: Packaging extension..." -ForegroundColor Yellow
npm run package
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Packaging failed!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "SUCCESS: Extension packaged!" -ForegroundColor Green
Write-Host ""

# Check if VSIX was created
if (Test-Path "a11yassist-1.0.0.vsix") {
    Write-Host "Package created: a11yassist-1.0.0.vsix" -ForegroundColor Cyan
    Write-Host ""

    # Step 4: Install
    $install = Read-Host "Install extension now? (y/n)"
    if ($install -eq "y") {
        Write-Host ""
        Write-Host "Step 4: Installing extension..." -ForegroundColor Yellow

        # Uninstall old version if exists
        Write-Host "Checking for existing installation..." -ForegroundColor Gray
        $existing = code --list-extensions | Select-String "ontario-tech-university.a11yassist"
        if ($existing) {
            Write-Host "Uninstalling old version..." -ForegroundColor Gray
            code --uninstall-extension ontario-tech-university.a11yassist
        }

        # Install new version
        code --install-extension a11yassist-1.0.0.vsix
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Installation failed!" -ForegroundColor Red
            pause
            exit 1
        }

        Write-Host ""
        Write-Host "================================================" -ForegroundColor Green
        Write-Host "  SUCCESS! A11YAssist installed!" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Restart VS Code" -ForegroundColor White
        Write-Host "2. Press Ctrl+Shift+K to open keyboard guide" -ForegroundColor White
        Write-Host "3. Press Ctrl+Shift+A to run accessibility audit" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "Extension packaged but not installed." -ForegroundColor Yellow
        Write-Host "To install later, run:" -ForegroundColor Yellow
        Write-Host "  code --install-extension a11yassist-1.0.0.vsix" -ForegroundColor Cyan
        Write-Host ""
    }
} else {
    Write-Host "ERROR: Package file not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "GitHub: https://github.com/jangarohitha94/a11yassist-vscode" -ForegroundColor Gray
Write-Host "Authors: Sudha Rajendran and Rohitha Janga" -ForegroundColor Gray
Write-Host ""
pause
