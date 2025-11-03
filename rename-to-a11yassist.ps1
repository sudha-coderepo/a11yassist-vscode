# PowerShell Script to Rename Accessibility Enhancer to A11YAssist
# Authors: Sudha Rajendran and Rohitha Janga
# Ontario Tech University

Write-Host "Renaming Accessibility Enhancer to A11YAssist..." -ForegroundColor Green

# Get all TypeScript files in src directory
$files = Get-ChildItem -Path ".\src" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow

    # Read file content
    $content = Get-Content $file.FullName -Raw

    # Replace command names
    $content = $content -replace 'accessibility-enhancer\.', 'a11yassist.'
    $content = $content -replace 'accessibilityEnhancer\.', 'a11yassist.'

    # Replace display names (keep class names as they are)
    $content = $content -replace 'Accessibility Enhancer extension', 'A11YAssist extension'
    $content = $content -replace 'Accessibility Enhancer Extension', 'A11YAssist Extension'
    $content = $content -replace 'Accessibility Enhancer!', 'A11YAssist!'
    $content = $content -replace 'Welcome to Accessibility Enhancer', 'Welcome to A11YAssist'

    # Replace tree view IDs
    $content = $content -replace 'accessibility-panel', 'a11yassist-panel'
    $content = $content -replace 'accessibilityIssues', 'a11yassistIssues'
    $content = $content -replace 'accessibilityGuide', 'a11yassistGuide'
    $content = $content -replace 'accessibilityStats', 'a11yassistStats'

    # Replace extension IDs
    $content = $content -replace "'ontario-tech-university.accessibility-enhancer'", "'ontario-tech-university.a11yassist'"

    # Write back to file
    Set-Content -Path $file.FullName -Value $content -NoNewline

    Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
}

Write-Host "`nRenaming complete!" -ForegroundColor Green
Write-Host "All references to 'accessibility-enhancer' have been changed to 'a11yassist'" -ForegroundColor Cyan
