# Додавання адміністратора та балансу

## Для користувача @BronhoFather

### Крок 1: Знайдіть Telegram ID користувача

Користувач повинен спочатку зареєструватися через Telegram WebApp. Після реєстрації:

1. Перевірте логи сервера після `/start` в боті
2. Або використайте бота [@userinfobot](https://t.me/userinfobot)
3. Або знайдіть в базі даних `data/users.json` за username `BronhoFather`

### Крок 2: Додайте баланс через API

Використайте PowerShell скрипт або API напряму:

```powershell
# Отримайте initData з Telegram WebApp (F12 → Console → window.Telegram.WebApp.initData)
$initData = "ваш_initData"

# Знайдіть Telegram ID користувача @BronhoFather
$userId = "TELEGRAM_ID_BRONHOFATHER" # Замініть на реальний ID

# Нарахуйте 10 USDT (10 BTC еквівалент)
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

Invoke-RestMethod -Uri "https://auraslots.fly.dev/api/admin/users/$userId/balance" `
    -Method POST -Headers $headers -Body $body
```

### Крок 3: Додайте до ADMIN_IDS

Після нарахування балансу, додайте Telegram ID користувача до ADMIN_IDS:

```bash
# Отримайте поточний список адмінів
fly secrets list --app auraslots

# Додайте новий ID (замініть YOUR_TELEGRAM_ID на реальний ID користувача)
fly secrets set ADMIN_IDS=existing_id,YOUR_TELEGRAM_ID --app auraslots
```

### Альтернатива: Через скрипт

Якщо користувач вже зареєстрований:

```bash
cd backend
node ../add_admin_user.js
```

Скрипт автоматично:
- Знайде користувача за username `BronhoFather`
- Нарахує 10 USDT балансу
- Створить транзакцію
- Покаже команду для додавання до ADMIN_IDS

## Перевірка

Після виконання:
1. Користувач має 10 USDT на балансі
2. Користувач має доступ до адмін-панелі через API
3. Перевірте: `GET /api/admin/dashboard` з initData користувача
