# Додавання балансу користувачу @BronhoFather
# Telegram ID: 912756276
# Баланс: 10 USDT (еквівалент 10 BTC)

Write-Host "=== Додавання балансу користувачу @BronhoFather ===" -ForegroundColor Green
Write-Host ""

# Отримати initData адміна
Write-Host "1. Отримайте initData адміна:" -ForegroundColor Yellow
Write-Host "   - Відкрийте Telegram WebApp" -ForegroundColor Cyan
Write-Host "   - Натисніть F12" -ForegroundColor Cyan
Write-Host "   - Виконайте: window.Telegram.WebApp.initData" -ForegroundColor Cyan
Write-Host ""

$initData = Read-Host "Введіть initData адміна"

if ([string]::IsNullOrWhiteSpace($initData)) {
    Write-Host "❌ initData не може бути порожнім!" -ForegroundColor Red
    exit
}

# Параметри
$userId = "912756276"  # Telegram ID користувача @BronhoFather
$amount = 10
$currency = "USDT"
$type = "balance"
$description = "Поповнення балансу від Aura Team"

Write-Host ""
Write-Host "2. Нарахування балансу..." -ForegroundColor Yellow
Write-Host "   Користувач ID: $userId" -ForegroundColor Cyan
Write-Host "   Сума: $amount $currency" -ForegroundColor Cyan
Write-Host ""

$body = @{
    amount = $amount
    currency = $currency
    type = $type
    description = $description
} | ConvertTo-Json

$headers = @{
    "x-telegram-init-data" = $initData
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId/balance" -Method POST -Headers $headers -Body $body
    
    if ($response.success) {
        Write-Host "✅ Баланс успішно нараховано!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Користувач:" -ForegroundColor Cyan
        Write-Host "  ID: $($response.user.id)" -ForegroundColor White
        Write-Host "  Telegram ID: $($response.user.telegram_id)" -ForegroundColor White
        Write-Host "  Username: $($response.user.username)" -ForegroundColor White
        Write-Host ""
        Write-Host "Баланс:" -ForegroundColor Cyan
        Write-Host "  Основний: $($response.user.balance) USDT" -ForegroundColor White
        Write-Host "  Бонусний: $($response.user.bonus_balance) USDT" -ForegroundColor White
    } else {
        Write-Host "❌ Помилка: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Помилка запиту:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host ""
        Write-Host "Деталі помилки:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "💡 Можливі причини:" -ForegroundColor Yellow
    Write-Host "   - Маршрут не задеплоєно (запустіть: fly deploy --app auraslots)" -ForegroundColor Cyan
    Write-Host "   - Неправильний initData адміна" -ForegroundColor Cyan
    Write-Host "   - Користувач не в ADMIN_IDS (перевірте fly secrets)" -ForegroundColor Cyan
    Write-Host "   - Користувач з ID $userId не знайдений" -ForegroundColor Cyan
}
