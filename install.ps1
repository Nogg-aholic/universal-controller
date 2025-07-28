# Universal Controller Installation Script

Write-Host "Installing Universal Controller for Home Assistant..." -ForegroundColor Green

# Check if we're in a Home Assistant directory
$configPath = ".\configuration.yaml"
if (-not (Test-Path $configPath)) {
    Write-Host "Warning: configuration.yaml not found. Make sure you're in your Home Assistant directory." -ForegroundColor Yellow
}

# Create custom_components directory if it doesn't exist
$customComponentsPath = ".\custom_components"
if (-not (Test-Path $customComponentsPath)) {
    Write-Host "Creating custom_components directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $customComponentsPath -Force
}

# Create www directory if it doesn't exist
$wwwPath = ".\www"
if (-not (Test-Path $wwwPath)) {
    Write-Host "Creating www directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $wwwPath -Force
}

# Copy integration files
Write-Host "Copying integration files..." -ForegroundColor Yellow
$sourcePath = ".\custom_components\universal_controller"
$targetPath = "$customComponentsPath\universal_controller"

if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination $targetPath -Recurse -Force
    Write-Host "✓ Integration files copied" -ForegroundColor Green
} else {
    Write-Host "✗ Source integration files not found at $sourcePath" -ForegroundColor Red
    exit 1
}

# Copy card files
Write-Host "Copying card files..." -ForegroundColor Yellow
$cardSourcePath = ".\www\universal-controller"
$cardTargetPath = "$wwwPath\universal-controller"

if (Test-Path $cardSourcePath) {
    Copy-Item -Path $cardSourcePath -Destination $cardTargetPath -Recurse -Force
    Write-Host "✓ Card files copied" -ForegroundColor Green
} else {
    Write-Host "✗ Source card files not found at $cardSourcePath" -ForegroundColor Red
    exit 1
}

# Build the card
Write-Host "Building TypeScript card..." -ForegroundColor Yellow
Set-Location "$cardTargetPath"

if (Test-Path ".\package.json") {
    try {
        & npm install
        & npm run build
        Write-Host "✓ Card built successfully" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to build card: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ package.json not found in card directory" -ForegroundColor Red
    exit 1
}

Set-Location "..\.."

# Check Lovelace configuration
Write-Host "Checking Lovelace configuration..." -ForegroundColor Yellow
$lovelaceConfigExists = $false

if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    if ($configContent -match "lovelace:" -and $configContent -match "resources:") {
        Write-Host "✓ Lovelace resources section found" -ForegroundColor Green
        $lovelaceConfigExists = $true
    }
}

if (-not $lovelaceConfigExists) {
    Write-Host "⚠ Please add the following to your configuration.yaml:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "lovelace:" -ForegroundColor Cyan
    Write-Host "  resources:" -ForegroundColor Cyan
    Write-Host "    - url: /local/universal-controller/dist/universal-controller-card.js" -ForegroundColor Cyan
    Write-Host "      type: module" -ForegroundColor Cyan
    Write-Host ""
}

# Final instructions
Write-Host ""
Write-Host "Installation completed! " -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart Home Assistant" -ForegroundColor White
Write-Host "2. Go to Settings -> Integrations" -ForegroundColor White
Write-Host "3. Click 'Add Integration'" -ForegroundColor White
Write-Host "4. Search for 'Universal Controller'" -ForegroundColor White
Write-Host "5. Follow the setup wizard" -ForegroundColor White
Write-Host ""
Write-Host "Add to your Lovelace dashboard:" -ForegroundColor Yellow
Write-Host "type: custom:universal-controller-card" -ForegroundColor Cyan
Write-Host "entity: sensor.universal_controller_your_instance" -ForegroundColor Cyan
Write-Host "name: My Universal Controller" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
