# 🔧 Виправлення деплою на Fly.io

Якщо сайт не працює на `https://auraslots.fly.dev`, виконайте ці кроки:

## Крок 1: Перевірте встановлення Fly CLI

```powershell
fly version
```

Якщо не встановлено:
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

## Крок 2: Авторизуйтесь

```powershell
fly auth login
```

## Крок 3: Перевірте, чи існує додаток

```powershell
fly apps list
```

Якщо `auraslots` немає в списку, створіть його:

```powershell
fly launch --name auraslots --region iad --no-deploy
```

Відповідайте:
- Use existing app? → **No**
- Select region: → **iad**
- Postgresql? → **No**
- Redis? → **No**

## Крок 4: Встановіть Secrets

**Спочатку дізнайтеся Telegram ID користувача @BronhoFather:**
1. Напишіть [@userinfobot](https://t.me/userinfobot) в Telegram
2. Скопіюйте ваш ID (це число)

**Потім встановіть secrets:**

```powershell
# Замініть на ваші значення
fly secrets set TELEGRAM_BOT_TOKEN="ваш_бот_токен"
fly secrets set TELEGRAM_WEBAPP_URL="https://auraslots.fly.dev"
fly secrets set ADMIN_IDS="ваш_telegram_id"
fly secrets set NODE_ENV="production"
```

**Перевірте secrets:**
```powershell
fly secrets list
```

## Крок 5: Задеплойте

```powershell
fly deploy
```

Це займе 5-10 хвилин. Чекайте завершення.

## Крок 6: Перевірте статус

```powershell
fly status
fly logs
```

## Крок 7: Перевірте сайт

Відкрийте в браузері:
- https://auraslots.fly.dev/health
- Має показати: `{"status":"ok","timestamp":"..."}`

## Якщо все ще не працює:

### Перевірте логи:
```powershell
fly logs
```

### Перезапустіть додаток:
```powershell
fly apps restart auraslots
```

### Перевірте конфігурацію:
```powershell
fly config validate
```

### Якщо є помилки в логах:
1. Перевірте, чи правильно встановлені secrets
2. Перевірте, чи бот токен правильний
3. Перевірте, чи немає помилок у коді

## Після успішного деплою:

### URL для Telegram Mini App:
```
https://auraslots.fly.dev
```

### Адмін панель:
```
https://auraslots.fly.dev/api/admin/dashboard
```

### Налаштуйте Menu Button в BotFather:
1. Відкрийте [@BotFather](https://t.me/BotFather)
2. `/setmenubutton`
3. Виберіть вашого бота
4. Текст: `🎰 Відкрити казино`
5. URL: `https://auraslots.fly.dev`
