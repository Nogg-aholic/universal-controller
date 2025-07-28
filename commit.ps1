# Quick Development Commit Script
# Usage: .\commit.ps1 "Your commit message"

param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

Write-Host "📝 Committing: $Message" -ForegroundColor Cyan

git add .
git commit -m "$Message"
git push origin main

Write-Host "✅ Pushed to GitHub" -ForegroundColor Green
