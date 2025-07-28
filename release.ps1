# Universal Controller - Automated Release Script
# This script automatically increments version, commits, tags, and pushes to GitHub

param(
    [ValidateSet("patch", "minor", "major")]
    [string]$VersionType = "patch",
    [string]$Message = ""
)

Write-Host "🚀 Universal Controller Release Automation" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Get current version from manifest.json
$manifestPath = "custom_components\universal_controller\manifest.json"
if (-not (Test-Path $manifestPath)) {
    Write-Error "❌ Manifest file not found: $manifestPath"
    exit 1
}

$manifest = Get-Content $manifestPath | ConvertFrom-Json
$currentVersion = $manifest.version
Write-Host "📋 Current version: $currentVersion" -ForegroundColor Yellow

# Parse version parts
$versionParts = $currentVersion -split '\.'
$major = [int]$versionParts[0]
$minor = [int]$versionParts[1] 
$patch = [int]$versionParts[2]

# Increment version based on type
switch ($VersionType) {
    "major" { 
        $major++; $minor = 0; $patch = 0 
        Write-Host "📈 Incrementing MAJOR version" -ForegroundColor Green
    }
    "minor" { 
        $minor++; $patch = 0 
        Write-Host "📈 Incrementing MINOR version" -ForegroundColor Green
    }
    "patch" { 
        $patch++ 
        Write-Host "📈 Incrementing PATCH version" -ForegroundColor Green
    }
}

$newVersion = "$major.$minor.$patch"
Write-Host "🎯 New version: $newVersion" -ForegroundColor Green

# Update manifest.json
Write-Host "📝 Updating manifest.json..." -ForegroundColor Blue
$manifest.version = $newVersion
$json = $manifest | ConvertTo-Json -Depth 10 -Compress
$json | Set-Content $manifestPath -Encoding UTF8

# Check if there are any changes to commit
$gitStatus = git status --porcelain
if (-not $gitStatus) {
    Write-Host "⚠️  No changes to commit" -ForegroundColor Yellow
    exit 0
}

# Create commit message
if (-not $Message) {
    $Message = "Release version $newVersion"
}

Write-Host "📦 Committing changes..." -ForegroundColor Blue
git add .
git commit -m "$Message

- Version bump to $newVersion
- Automated release via release script"

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Failed to commit changes"
    exit 1
}

# Create and push tag
Write-Host "🏷️  Creating tag v$newVersion..." -ForegroundColor Blue
git tag "v$newVersion"

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Failed to create tag"
    exit 1
}

# Push changes and tags
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Blue
git push origin main --tags

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Failed to push to GitHub"
    exit 1
}

Write-Host ""
Write-Host "✅ Successfully released version $newVersion!" -ForegroundColor Green
Write-Host "🔗 GitHub: https://github.com/Nogg-aholic/universal-controller" -ForegroundColor Cyan
Write-Host "📦 HACS will detect the new version automatically" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Release complete! 🎉" -ForegroundColor Magenta
