# Швидкий тест адмін API
# Використання: .\QUICK_TEST.ps1

Write-Host "=== Тест адмін API ===" -ForegroundColor Green
Write-Host ""

# Отримати initData
Write-Host "1. Отримайте initData:" -ForegroundColor Yellow
Write-Host "   - Відкрийте Telegram WebApp" -ForegroundColor Cyan
Write-Host "   - Натисніть F12" -ForegroundColor Cyan
Write-Host "   - Виконайте: window.Telegram.WebApp.initData" -ForegroundColor Cyan
Write-Host ""

$initData = Read-Host "Введіть initData"

if ([string]::IsNullOrWhiteSpace($initData)) {
    Write-Host "❌ initData не може бути порожнім!" -ForegroundColor Red
    exit
}

$userId = Read-Host "Введіть Telegram ID користувача"
$amount = Read-Host "Введіть суму для нарахування"

if ([string]::IsNullOrWhiteSpace($userId) -or [string]::IsNullOrWhiteSpace($amount)) {
    Write-Host "❌ Поля не можуть бути порожніми!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Виберіть тип балансу:" -ForegroundColor Yellow
Write-Host "1. Основний баланс (balance)"
Write-Host "2. Бонусний баланс (bonus)"
$typeChoice = Read-Host "Виберіть (1 або 2)"

$type = if ($typeChoice -eq "2") { "bonus" } else { "balance" }

$description = Read-Host "Введіть опис (Enter для пропуску)"

$body = @{
    amount = [double]$amount
    currency = "USDT"
    type = $type
    description = if ([string]::IsNullOrWhiteSpace($description)) { "Admin bonus" } else { $description }
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "x-telegram-init-data" = $initData
}

Write-Host ""
Write-Host "Відправка запиту..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId/balance" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    Write-Host ""
    Write-Host "✅ Успішно!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host ""
    Write-Host "❌ Помилка:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    if ($_.ErrorDetails.Message) {
        Write-Host ""
        Write-Host "Деталі:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message
    }
    
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host ""
        Write-Host "💡 Можливі причини:" -ForegroundColor Yellow
        Write-Host "   - Роут ще не задеплоєний (виконайте: fly deploy --app auraslots)" -ForegroundColor Cyan
        Write-Host "   - Користувач не знайдений" -ForegroundColor Cyan
    }
    
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host ""
        Write-Host "💡 Можливі причини:" -ForegroundColor Yellow
        Write-Host "   - Ваш Telegram ID не в ADMIN_IDS" -ForegroundColor Cyan
        Write-Host "   - Перевірте: fly secrets list --app auraslots" -ForegroundColor Cyan
    }
}
