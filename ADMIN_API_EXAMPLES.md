# Приклади використання адмін API

## ⚠️ Важливо: PowerShell не підтримує curl синтаксис!

В PowerShell використовуйте `Invoke-RestMethod` або `Invoke-WebRequest` замість `curl`.

## 📋 Отримання initData

Перед використанням API потрібно отримати `initData`:

1. Відкрийте Telegram WebApp вашого бота
2. Натисніть F12 (відкрити DevTools)
3. В консолі виконайте: `window.Telegram.WebApp.initData`
4. Скопіюйте результат

## 💰 Нарахування балансу користувачу

### PowerShell команда:

```powershell
$initData = "ВАШ_INIT_DATA_ТУТ"
$userId = "123456789"
$body = @{
    amount = 10
    currency = "USDT"
    type = "balance"
    description = "Бонус за активність"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "x-telegram-init-data" = $initData
}

Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId/balance" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

### Нарахування бонусного балансу:

```powershell
$initData = "ВАШ_INIT_DATA_ТУТ"
$userId = "123456789"
$body = @{
    amount = 5
    currency = "USDT"
    type = "bonus"
    description = "Промо-бонус"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "x-telegram-init-data" = $initData
}

Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId/balance" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

## 👤 Отримати інформацію про користувача

```powershell
$initData = "ВАШ_INIT_DATA_ТУТ"
$userId = "123456789"

$headers = @{
    "x-telegram-init-data" = $initData
}

Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId" `
    -Method GET `
    -Headers $headers
```

## 🔍 Пошук користувачів

```powershell
$initData = "ВАШ_INIT_DATA_ТУТ"
$query = "username"

$headers = @{
    "x-telegram-init-data" = $initData
}

Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/search/$query" `
    -Method GET `
    -Headers $headers
```

## 📊 Dashboard статистика

```powershell
$initData = "ВАШ_INIT_DATA_ТУТ"

$headers = @{
    "x-telegram-init-data" = $initData
}

Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/dashboard" `
    -Method GET `
    -Headers $headers
```

## 🚀 Використання готового скрипту

Використайте файл `test_admin_api.ps1`:

```powershell
# Завантажити функції
. .\test_admin_api.ps1

# Нарахувати баланс
Add-Balance -userId "123456789" -amount 10 -type "balance" -description "Бонус"

# Отримати інформацію про користувача
Get-User -userId "123456789"

# Пошук користувачів
Search-Users -query "username"
```

## ⚠️ Якщо отримуєте помилку "Cannot POST"

Це означає, що нові роути ще не задеплоєні. Потрібно:

1. Переконайтеся, що зміни збережені
2. Задеплойте на Fly.io:
```bash
fly deploy --app auraslots
```

3. Дочекайтеся завершення деплою
4. Спробуйте знову

## 🔐 Перевірка доступу

Якщо отримуєте помилку "Forbidden: Admin access required":

1. Перевірте, що ваш Telegram ID додано до `ADMIN_IDS`:
```bash
fly secrets list --app auraslots
```

2. Якщо немає, додайте:
```bash
fly secrets set ADMIN_IDS=ваш_telegram_id --app auraslots
```

3. Перезапустіть додаток:
```bash
fly apps restart auraslots
```
