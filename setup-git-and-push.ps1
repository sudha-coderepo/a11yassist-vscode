# A11YAssist - Git Setup and Push Script
# Authors: Sudha Rajendran and Rohitha Janga
# Institution: Ontario Tech University
# GitHub: jangarohitha94/a11yassist-vscode

param(
    [string]$Email = "",
    [string]$Name = "Rohitha Janga"
)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  A11YAssist - Git Setup and Push to GitHub" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
$gitVersion = git --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "Git installed: $gitVersion" -ForegroundColor Green
Write-Host ""

# Check if already a Git repository
if (Test-Path ".git") {
    Write-Host "Git repository already initialized." -ForegroundColor Yellow
    $reinit = Read-Host "Reinitialize? This will remove Git history. (y/n)"
    if ($reinit -eq "y") {
        Remove-Item -Recurse -Force .git
        Write-Host "Git repository removed." -ForegroundColor Gray
    } else {
        Write-Host "Using existing Git repository." -ForegroundColor Green
        Write-Host ""
    }
}

# Initialize Git repository
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to initialize Git!" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "Git repository initialized!" -ForegroundColor Green
    Write-Host ""
}

# Configure Git user
Write-Host "Configuring Git user..." -ForegroundColor Yellow

if ($Email -eq "") {
    $Email = Read-Host "Enter your email address"
}

if ($Name -eq "") {
    $Name = Read-Host "Enter your name"
}

git config user.name "$Name"
git config user.email "$Email"

Write-Host "Git user configured:" -ForegroundColor Green
Write-Host "  Name: $Name" -ForegroundColor Gray
Write-Host "  Email: $Email" -ForegroundColor Gray
Write-Host ""

# Check if .gitignore exists
if (-not (Test-Path ".gitignore")) {
    Write-Host "WARNING: .gitignore not found!" -ForegroundColor Yellow
    Write-Host "A .gitignore file should exist to exclude node_modules, out/, etc." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ".gitignore found!" -ForegroundColor Green
    Write-Host ""
}

# Add all files
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to add files!" -ForegroundColor Red
    pause
    exit 1
}

# Show what will be committed
Write-Host "Files to be committed:" -ForegroundColor Cyan
git status --short
Write-Host ""

$continue = Read-Host "Continue with commit? (y/n)"
if ($continue -ne "y") {
    Write-Host "Aborted by user." -ForegroundColor Yellow
    exit 0
}

# Commit
Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: A11YAssist - Accessibility Assistant for VSCode

- Complete TypeScript implementation with 12 modules
- Screen reader support for visually impaired users
- Keyboard navigation for motor-limited users
- Accessibility auditing (WCAG 2.1, WAI-ARIA 1.2)
- Color contrast analysis
- Contextual guidance system
- Usage analytics (privacy-focused, local only)
- Comprehensive documentation for Windows
- Authors: Sudha Rajendran and Rohitha Janga
- Institution: Ontario Tech University
- License: MIT"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create commit!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "Commit created!" -ForegroundColor Green
Write-Host ""

# Rename branch to main
Write-Host "Renaming branch to 'main'..." -ForegroundColor Yellow
git branch -M main
Write-Host "Branch renamed to 'main'!" -ForegroundColor Green
Write-Host ""

# Check for remote
$remoteExists = git remote | Select-String "origin"
if ($remoteExists) {
    Write-Host "Remote 'origin' already exists." -ForegroundColor Yellow
    $remoteUrl = git remote get-url origin
    Write-Host "Current remote: $remoteUrl" -ForegroundColor Gray
    Write-Host ""
    $changeRemote = Read-Host "Change remote URL? (y/n)"
    if ($changeRemote -eq "y") {
        git remote remove origin
        Write-Host "Remote 'origin' removed." -ForegroundColor Gray
    } else {
        Write-Host "Keeping existing remote." -ForegroundColor Green
        Write-Host ""
    }
}

# Add remote if doesn't exist
if (-not (git remote | Select-String "origin")) {
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    $remoteUrl = "https://github.com/jangarohitha94/a11yassist-vscode.git"
    Write-Host "Remote URL: $remoteUrl" -ForegroundColor Gray

    git remote add origin $remoteUrl
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to add remote!" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "Remote added!" -ForegroundColor Green
    Write-Host ""
}

# Verify remote
Write-Host "Verifying remote..." -ForegroundColor Yellow
git remote -v
Write-Host ""

# Push to GitHub
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Ready to push to GitHub!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: You'll need to authenticate with GitHub" -ForegroundColor Yellow
Write-Host ""
Write-Host "Options:" -ForegroundColor Cyan
Write-Host "1. Username: jangarohitha94" -ForegroundColor White
Write-Host "2. Password: Use a Personal Access Token (NOT your regular password)" -ForegroundColor White
Write-Host ""
Write-Host "To create a token:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "  2. Click 'Generate new token (classic)'" -ForegroundColor Gray
Write-Host "  3. Select 'repo' scope" -ForegroundColor Gray
Write-Host "  4. Copy the token (starts with ghp_)" -ForegroundColor Gray
Write-Host "  5. Use it as your password" -ForegroundColor Gray
Write-Host ""

$push = Read-Host "Push to GitHub now? (y/n)"
if ($push -eq "y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host ""

    git push -u origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Green
        Write-Host "  SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your repository is now available at:" -ForegroundColor Cyan
        Write-Host "https://github.com/jangarohitha94/a11yassist-vscode" -ForegroundColor White
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Visit your repository on GitHub" -ForegroundColor White
        Write-Host "2. Add topics: accessibility, vscode-extension, a11y" -ForegroundColor White
        Write-Host "3. Update the About section" -ForegroundColor White
        Write-Host "4. Create a release with the .vsix file" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "ERROR: Push failed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "1. Authentication failed - Use a Personal Access Token" -ForegroundColor White
        Write-Host "2. Repository doesn't exist - Create it on GitHub first" -ForegroundColor White
        Write-Host "3. Network issues - Check your internet connection" -ForegroundColor White
        Write-Host ""
        Write-Host "To try again manually:" -ForegroundColor Yellow
        Write-Host "  git push -u origin main" -ForegroundColor Cyan
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "Push skipped." -ForegroundColor Yellow
    Write-Host "To push later, run:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Git setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Common Git commands:" -ForegroundColor Cyan
Write-Host "  git status       - Check file status" -ForegroundColor Gray
Write-Host "  git add .        - Stage all changes" -ForegroundColor Gray
Write-Host "  git commit -m    - Commit changes" -ForegroundColor Gray
Write-Host "  git push         - Push to GitHub" -ForegroundColor Gray
Write-Host "  git pull         - Pull from GitHub" -ForegroundColor Gray
Write-Host ""
Write-Host "Authors: Sudha Rajendran and Rohitha Janga" -ForegroundColor Gray
Write-Host "Institution: Ontario Tech University" -ForegroundColor Gray
Write-Host ""
pause
