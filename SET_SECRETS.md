# Встановлення Secrets для AURA Casino

Після успішного деплою виконайте ці команди для налаштування:

## 1. Дізнайтеся Telegram ID користувача @BronhoFather

Напишіть [@userinfobot](https://t.me/userinfobot) в Telegram та скопіюйте ваш ID.

## 2. Встановіть Secrets

```powershell
# Замініть на ваші значення
fly secrets set TELEGRAM_BOT_TOKEN="ваш_бот_токен" --app auraslots
fly secrets set TELEGRAM_WEBAPP_URL="https://auraslots.fly.dev" --app auraslots
fly secrets set ADMIN_IDS="ваш_telegram_id" --app auraslots
fly secrets set NODE_ENV="production" --app auraslots
```

## 3. Перезапустіть додаток

```powershell
fly apps restart auraslots
```

## 4. Перевірте логи

```powershell
fly logs --app auraslots
```

## 5. Перевірте роботу

Відкрийте в браузері:
- https://auraslots.fly.dev/health
- Має показати: `{"status":"ok","timestamp":"..."}`
