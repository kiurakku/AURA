# Швидке додавання користувача @BronhoFather
# Використання: .\QUICK_ADD_BRONHOFATHER.ps1

Write-Host "=== Додавання користувача @BronhoFather ===" -ForegroundColor Green
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

# Знайти користувача
Write-Host ""
Write-Host "2. Пошук користувача @BronhoFather..." -ForegroundColor Yellow

$headers = @{
    "x-telegram-init-data" = $initData
}

try {
    $searchResult = Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/search/BronhoFather" `
        -Method GET -Headers $headers
    
    if ($searchResult.users -and $searchResult.users.Count -gt 0) {
        $user = $searchResult.users[0]
        Write-Host "✅ Знайдено користувача:" -ForegroundColor Green
        Write-Host "   - Username: @$($user.username)" -ForegroundColor Cyan
        Write-Host "   - Telegram ID: $($user.telegram_id)" -ForegroundColor Cyan
        Write-Host "   - Поточний баланс: $($user.balance) USDT" -ForegroundColor Cyan
        
        $userId = $user.telegram_id
    } else {
        Write-Host "❌ Користувач @BronhoFather не знайдений!" -ForegroundColor Red
        Write-Host "💡 Користувач повинен спочатку зареєструватися через Telegram WebApp" -ForegroundColor Yellow
        exit
    }
} catch {
    Write-Host "❌ Помилка пошуку:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit
}

# Нарахувати баланс
Write-Host ""
Write-Host "3. Нарахування балансу..." -ForegroundColor Yellow

$body = @{
    amount = 10
    currency = "USDT"
    type = "balance"
    description = "Admin bonus: 10 BTC"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "x-telegram-init-data" = $initData
}

try {
    $response = Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId/balance" `
        -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Баланс нараховано!" -ForegroundColor Green
    Write-Host "   - Новий баланс: $($response.user.balance) USDT" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Помилка нарахування балансу:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit
}

# Додати до ADMIN_IDS
Write-Host ""
Write-Host "4. Додавання до ADMIN_IDS..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Виконайте команду:" -ForegroundColor Yellow
Write-Host "   fly secrets set ADMIN_IDS=existing_ids,$userId --app auraslots" -ForegroundColor Cyan
Write-Host ""
Write-Host "   (замініть existing_ids на поточні ID адмінів, якщо вони є)" -ForegroundColor Gray
Write-Host ""

$addToAdmin = Read-Host "Додати до ADMIN_IDS зараз? (y/n)"

if ($addToAdmin -eq "y" -or $addToAdmin -eq "Y") {
    Write-Host ""
    Write-Host "Перевірте поточні ADMIN_IDS:" -ForegroundColor Yellow
    Write-Host "   fly secrets list --app auraslots" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Потім додайте:" -ForegroundColor Yellow
    Write-Host "   fly secrets set ADMIN_IDS=existing_ids,$userId --app auraslots" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Готово!" -ForegroundColor Green
Write-Host "   - Користувач: @BronhoFather" -ForegroundColor Cyan
Write-Host "   - Telegram ID: $userId" -ForegroundColor Cyan
Write-Host "   - Баланс: 10 USDT" -ForegroundColor Cyan
Write-Host "   - Транзакція створена" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Не забудьте додати Telegram ID до ADMIN_IDS!" -ForegroundColor Yellow
