# PowerShell скрипт для тестування адмін API
# Використання: .\test_admin_api.ps1

$baseUrl = "https://auraslots.fly.dev"
$initData = "YOUR_INIT_DATA_HERE" # Замініть на ваш initData з Telegram WebApp

# Функція для отримання initData з браузера
function Get-InitData {
    Write-Host "Для отримання initData:" -ForegroundColor Yellow
    Write-Host "1. Відкрийте Telegram WebApp вашого бота" -ForegroundColor Cyan
    Write-Host "2. Натисніть F12 (відкрити DevTools)" -ForegroundColor Cyan
    Write-Host "3. В консолі виконайте: window.Telegram.WebApp.initData" -ForegroundColor Cyan
    Write-Host "4. Скопіюйте результат і вставте нижче" -ForegroundColor Cyan
    Write-Host ""
    $global:initData = Read-Host "Введіть initData"
}

# Нарахування балансу користувачу
function Add-Balance {
    param(
        [string]$userId,
        [double]$amount,
        [string]$type = "balance",
        [string]$description = "Admin bonus"
    )
    
    if (-not $global:initData) {
        Get-InitData
    }
    
    $body = @{
        amount = $amount
        currency = "USDT"
        type = $type
        description = $description
    } | ConvertTo-Json
    
    $headers = @{
        "Content-Type" = "application/json"
        "x-telegram-init-data" = $global:initData
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/admin/users/$userId/balance" `
            -Method POST `
            -Headers $headers `
            -Body $body
        
        Write-Host "✅ Успішно!" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "❌ Помилка:" -ForegroundColor Red
        Write-Host $_.Exception.Message
        if ($_.ErrorDetails.Message) {
            Write-Host $_.ErrorDetails.Message
        }
    }
}

# Отримати інформацію про користувача
function Get-User {
    param([string]$userId)
    
    if (-not $global:initData) {
        Get-InitData
    }
    
    $headers = @{
        "x-telegram-init-data" = $global:initData
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/admin/users/$userId" `
            -Method GET `
            -Headers $headers
        
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "❌ Помилка:" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# Пошук користувачів
function Search-Users {
    param([string]$query)
    
    if (-not $global:initData) {
        Get-InitData
    }
    
    $headers = @{
        "x-telegram-init-data" = $global:initData
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/admin/users/search/$query" `
            -Method GET `
            -Headers $headers
        
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "❌ Помилка:" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# Приклади використання:
Write-Host "=== Приклади використання ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. Нарахувати 10 USDT основного балансу користувачу:" -ForegroundColor Yellow
Write-Host '   Add-Balance -userId "123456789" -amount 10 -type "balance" -description "Бонус"' -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Нарахувати 5 USDT бонусного балансу:" -ForegroundColor Yellow
Write-Host '   Add-Balance -userId "123456789" -amount 5 -type "bonus" -description "Промо"' -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Отримати інформацію про користувача:" -ForegroundColor Yellow
Write-Host '   Get-User -userId "123456789"' -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Пошук користувачів:" -ForegroundColor Yellow
Write-Host '   Search-Users -query "username"' -ForegroundColor Cyan
Write-Host ""
