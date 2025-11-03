# PowerShell Script to Fix Class Names
# Authors: Sudha Rajendran and Rohitha Janga
# Ontario Tech University

Write-Host "Fixing class names..." -ForegroundColor Green

# Get all TypeScript files in src directory
$files = Get-ChildItem -Path ".\src" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Fix class names that were incorrectly changed
    $content = $content -replace 'export class a11yassist', 'export class Accessibility'
    $content = $content -replace 'new a11yassist', 'new Accessibility'

    # Write back to file
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Class names fixed!" -ForegroundColor Green
