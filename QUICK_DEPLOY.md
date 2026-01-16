# 🚀 Швидкий деплой на Fly.io

## Автоматичний деплой (PowerShell)

```powershell
.\deploy.ps1
```

Скрипт автоматично:
- ✅ Перевірить встановлення Fly CLI
- ✅ Створить додаток `auraslots`
- ✅ Налаштує secrets
- ✅ Задеплоїть проект

## Ручний деплой

### 1. Встановіть Fly CLI
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### 2. Авторизуйтесь
```powershell
fly auth login
```

### 3. Створіть додаток
```powershell
fly launch --name auraslots --region iad
```

Відповідайте:
- Use existing app? → **No**
- Select region: → **iad**
- Postgresql? → **No**
- Redis? → **No**

### 4. Встановіть Secrets

**Спочатку дізнайтеся Telegram ID користувача @BronhoFather:**
1. Напишіть [@userinfobot](https://t.me/userinfobot)
2. Скопіюйте ваш ID

**Потім встановіть secrets:**
```powershell
fly secrets set TELEGRAM_BOT_TOKEN="ваш_бот_токен"
fly secrets set TELEGRAM_WEBAPP_URL="https://auraslots.fly.dev"
fly secrets set ADMIN_IDS="ваш_telegram_id"
fly secrets set NODE_ENV="production"
```

### 5. Задеплойте
```powershell
fly deploy
```

### 6. Перевірте
```powershell
fly status
fly logs
```

## 📱 Готові посилання

### Для Telegram Mini App:
```
https://auraslots.fly.dev
```

### Адмін панель:
```
https://auraslots.fly.dev/api/admin/dashboard
```

### Health Check:
```
https://auraslots.fly.dev/health
```

## ⚙️ Налаштування Telegram Bot

1. Відкрийте [@BotFather](https://t.me/BotFather)
2. Виберіть вашого бота
3. `/setmenubutton`
4. Виберіть бота
5. Введіть текст: `🎰 Відкрити казино`
6. Введіть URL: `https://auraslots.fly.dev`

## 🔍 Перевірка роботи

1. Відкрийте https://auraslots.fly.dev/health - має показати `{"status":"ok"}`
2. Відкрийте додаток в Telegram
3. Перевірте адмін панель (якщо ваш ID в ADMIN_IDS)

## 📊 Корисні команди

```powershell
# Переглянути логи
fly logs

# Перезапустити
fly apps restart auraslots

# Статус
fly status

# SSH доступ
fly ssh console

# Переглянути secrets
fly secrets list
```

## 🆘 Troubleshooting

### Помилка при деплої
```powershell
fly logs
fly status
```

### Додаток не запускається
```powershell
fly ssh console
cd /app
node server.js
```

### Змінити secrets
```powershell
fly secrets set TELEGRAM_BOT_TOKEN="новий_токен"
fly deploy
```
