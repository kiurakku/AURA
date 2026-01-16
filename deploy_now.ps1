# Швидкий деплой AURA Casino на Fly.io

Write-Host "🚀 Встановлення secrets..." -ForegroundColor Cyan

fly secrets set TELEGRAM_BOT_TOKEN="8220670161:AAEDEyB-efY37A-1Mj0OuzJKP1YMrXscLLI" --app auraslots
fly secrets set TELEGRAM_WEBAPP_URL="https://auraslots.fly.dev" --app auraslots
fly secrets set NODE_ENV="production" --app auraslots

Write-Host "✅ Secrets встановлено" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Деплой додатку..." -ForegroundColor Cyan

fly deploy --app auraslots

Write-Host ""
Write-Host "✅ Деплой завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 URL для Mini App: https://auraslots.fly.dev" -ForegroundColor Cyan
Write-Host "🔧 Адмін панель: https://auraslots.fly.dev/api/admin/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Не забудьте встановити ADMIN_IDS після отримання Telegram ID!" -ForegroundColor Yellow
Write-Host "   Виконайте: fly secrets set ADMIN_IDS='ваш_id' --app auraslots" -ForegroundColor Yellow
