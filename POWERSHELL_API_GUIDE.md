# Як використовувати адмін API в PowerShell

## ⚠️ Важливо

PowerShell **НЕ підтримує** curl синтаксис з `\` для переносу рядків. Використовуйте `Invoke-RestMethod` або готові скрипти.

## 🚀 Швидкий старт

### Варіант 1: Готовий скрипт (рекомендовано)

```powershell
# Запустіть інтерактивний скрипт
.\QUICK_TEST.ps1
```

Скрипт сам запросить всі необхідні дані.

### Варіант 2: Вручну через PowerShell

```powershell
# 1. Отримайте initData з Telegram WebApp (F12 → Console → window.Telegram.WebApp.initData)
$initData = "ваш_initData_тут"

# 2. Вкажіть користувача та суму
$userId = "123456789"
$amount = 10

# 3. Створіть запит
$body = @{
    amount = $amount
    currency = "USDT"
    type = "balance"
    description = "Бонус за активність"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "x-telegram-init-data" = $initData
}

# 4. Відправте запит
Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId/balance" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

## 📝 Приклади

### Нарахувати основний баланс

```powershell
$initData = "ваш_initData"
$userId = "123456789"

$body = @{
    amount = 10
    currency = "USDT"
    type = "balance"
    description = "Бонус"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "x-telegram-init-data" = $initData
}

Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId/balance" `
    -Method POST -Headers $headers -Body $body
```

### Нарахувати бонусний баланс

```powershell
$initData = "ваш_initData"
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
    -Method POST -Headers $headers -Body $body
```

### Отримати інформацію про користувача

```powershell
$initData = "ваш_initData"
$userId = "123456789"

$headers = @{
    "x-telegram-init-data" = $initData
}

Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId" `
    -Method GET -Headers $headers
```

## ❌ Якщо отримуєте помилку "Cannot POST"

Це означає, що **нові роути ще не задеплоєні** на сервері.

### Рішення:

1. **Задеплойте зміни:**
```bash
fly deploy --app auraslots
```

2. **Дочекайтеся завершення деплою** (зазвичай 2-5 хвилин)

3. **Спробуйте знову**

## 🔐 Якщо отримуєте "Forbidden: Admin access required"

1. **Перевірте ваш Telegram ID:**
   - Напишіть боту [@userinfobot](https://t.me/userinfobot)
   - Або перевірте логи після `/start`

2. **Додайте ваш ID до ADMIN_IDS:**
```bash
fly secrets set ADMIN_IDS=ваш_telegram_id --app auraslots
```

3. **Перезапустіть додаток:**
```bash
fly apps restart auraslots
```

## 📋 Отримання initData

1. Відкрийте Telegram WebApp вашого бота
2. Натисніть **F12** (відкрити DevTools)
3. Перейдіть на вкладку **Console**
4. Виконайте команду:
```javascript
window.Telegram.WebApp.initData
```
5. Скопіюйте результат (це довгий рядок з параметрами)

**Важливо:** initData дійсний тільки 24 години. Якщо отримуєте помилку "Auth data expired", отримайте новий initData.

## 🛠️ Альтернатива: Використання Postman або Insomnia

Якщо PowerShell не зручний, використовуйте Postman або Insomnia:

1. Створіть новий POST запит
2. URL: `https://auraslots.fly.dev/api/admin/users/123456789/balance`
3. Headers:
   - `Content-Type: application/json`
   - `x-telegram-init-data: ваш_initData`
4. Body (JSON):
```json
{
  "amount": 10,
  "currency": "USDT",
  "type": "balance",
  "description": "Бонус"
}
```
