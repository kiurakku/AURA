# AURA Casino Deployment Script for Fly.io (PowerShell)

Write-Host "🚀 AURA Casino Deployment Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if fly CLI is installed
try {
    $null = fly version 2>&1
    Write-Host "✅ Fly CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Fly CLI is not installed!" -ForegroundColor Red
    Write-Host "Install it with: iwr https://fly.io/install.ps1 -useb | iex" -ForegroundColor Yellow
    exit 1
}

# Check if logged in
try {
    $null = fly auth whoami 2>&1
    Write-Host "✅ Logged in to Fly.io" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Not logged in to Fly.io" -ForegroundColor Yellow
    Write-Host "Please run: fly auth login" -ForegroundColor Yellow
    exit 1
}

# Check if app exists
$apps = fly apps list 2>&1
if ($apps -match "auraslots") {
    Write-Host "✅ App 'auraslots' already exists" -ForegroundColor Green
} else {
    Write-Host "📦 Creating new app 'auraslots'..." -ForegroundColor Yellow
    fly launch --name auraslots --region iad --no-deploy
}

# Set secrets
Write-Host ""
Write-Host "📝 Setting up secrets..." -ForegroundColor Cyan
$BOT_TOKEN = Read-Host "Telegram Bot Token"
$ADMIN_ID = Read-Host "Telegram ID for admin (@BronhoFather)"

fly secrets set "TELEGRAM_BOT_TOKEN=$BOT_TOKEN"
fly secrets set "TELEGRAM_WEBAPP_URL=https://auraslots.fly.dev"
fly secrets set "ADMIN_IDS=$ADMIN_ID"
fly secrets set "NODE_ENV=production"

Write-Host "✅ Secrets configured" -ForegroundColor Green

# Deploy
Write-Host ""
Write-Host "🚀 Deploying to Fly.io..." -ForegroundColor Cyan
fly deploy

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Your Mini App URL: https://auraslots.fly.dev" -ForegroundColor Cyan
Write-Host "🔧 Admin Panel: https://auraslots.fly.dev/api/admin/dashboard" -ForegroundColor Cyan
Write-Host "❤️  Health Check: https://auraslots.fly.dev/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set Menu Button in @BotFather with URL: https://auraslots.fly.dev"
Write-Host "2. Test the app in Telegram"
Write-Host "3. Check logs with: fly logs"
