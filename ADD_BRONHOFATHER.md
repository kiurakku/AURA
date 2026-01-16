# Додавання користувача @BronhoFather

## Інструкція для нарахування балансу та доступу до адмін-панелі

### Крок 1: Знайдіть Telegram ID користувача

Користувач @BronhoFather повинен спочатку зареєструватися через Telegram WebApp (відкрити бота та натиснути `/start`).

Після реєстрації знайдіть його Telegram ID одним з способів:

**Варіант А: Через логи бота**
```bash
fly logs --app auraslots | grep BronhoFather
```

**Варіант Б: Через базу даних**
1. Підключіться до контейнера: `fly ssh console --app auraslots`
2. Перевірте файл: `cat /app/data/users.json | grep BronhoFather`

**Варіант В: Через бота [@userinfobot](https://t.me/userinfobot)**
- Користувач може написати боту і отримати свій ID

### Крок 2: Нарахуйте баланс через API

Після того, як знайдете Telegram ID користувача, використайте PowerShell:

```powershell
# Отримайте initData з Telegram WebApp (F12 → Console → window.Telegram.WebApp.initData)
$initData = "ваш_initData_адміна"

# Замініть на реальний Telegram ID користувача @BronhoFather
$userId = "TELEGRAM_ID_BRONHOFATHER"

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
# Спочатку перевірте поточний список
fly secrets list --app auraslots

# Додайте новий ID (замініть YOUR_ID на реальний Telegram ID користувача)
# Якщо вже є інші адміни: fly secrets set ADMIN_IDS=existing_id1,existing_id2,YOUR_ID --app auraslots
# Якщо це перший адмін: fly secrets set ADMIN_IDS=YOUR_ID --app auraslots
```

### Крок 4: Перезапустіть додаток

```bash
fly apps restart auraslots
```

## Перевірка

Після виконання всіх кроків:

1. ✅ Користувач має 10 USDT на балансі
2. ✅ Користувач має доступ до адмін-панелі
3. ✅ Перевірте доступ: `GET /api/admin/dashboard` з initData користувача

## Альтернативний спосіб: Через скрипт

Якщо користувач вже зареєстрований, можна використати скрипт:

```bash
cd backend
node ../add_admin_user.js
```

Скрипт автоматично:
- Знайде користувача за username `BronhoFather`
- Нарахує 10 USDT балансу
- Створить транзакцію
- Покаже команду для додавання до ADMIN_IDS

## Примітка

Якщо користувач ще не зареєстрований:
1. Попросіть його відкрити бота та натиснути `/start`
2. Після реєстрації виконайте кроки вище
