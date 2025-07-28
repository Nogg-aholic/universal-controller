# Quick Version Bump Script
# Usage: .\bump.ps1 [patch|minor|major] ["commit message"]

param(
    [ValidateSet("patch", "minor", "major")]
    [string]$Type = "patch",
    [string]$Message = "Version bump and improvements"
)

# Get current version
$manifest = Get-Content "custom_components\universal_controller\manifest.json" | ConvertFrom-Json
$current = $manifest.version
$parts = $current -split '\.'

# Increment version
switch ($Type) {
    "major" { $new = "$([int]$parts[0] + 1).0.0" }
    "minor" { $new = "$($parts[0]).$([int]$parts[1] + 1).0" }
    "patch" { $new = "$($parts[0]).$($parts[1]).$([int]$parts[2] + 1)" }
}

Write-Host "🔄 $current → $new" -ForegroundColor Cyan

# Update manifest
$manifest.version = $new
$json = $manifest | ConvertTo-Json -Depth 10 -Compress
$json | Set-Content "custom_components\universal_controller\manifest.json" -Encoding UTF8

# Git operations
git add .
git commit -m "$Message`n`n- Version bump to $new"
git tag "v$new"
git push origin main --tags

Write-Host "✅ Released v$new" -ForegroundColor Green
