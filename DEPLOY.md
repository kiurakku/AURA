# 🚀 Інструкція по деплою на Fly.io

## Крок 1: Встановлення Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Або завантажте з https://fly.io/docs/hands-on/install-flyctl/
```

## Крок 2: Авторизація

```bash
fly auth login
```

## Крок 3: Створення додатку на Fly.io

```bash
fly launch --name auraslots --region iad
```

Відповідайте на питання:
- Use existing app? → **No**
- App name: → **auraslots**
- Select region: → **iad** (Washington, D.C.)
- Would you like to set up a Postgresql database now? → **No**
- Would you like to set up an Upstash Redis database now? → **No**

## Крок 4: Налаштування змінних середовища

```bash
# Встановіть ваш Telegram Bot Token
fly secrets set TELEGRAM_BOT_TOKEN="ваш_бот_токен"

# Встановіть URL вашого WebApp (буде доступний після деплою)
fly secrets set TELEGRAM_WEBAPP_URL="https://auraslots.fly.dev"

# Встановіть адмін ID (Telegram ID користувача @BronhoFather)
# Спочатку дізнайтеся ID через @userinfobot
fly secrets set ADMIN_IDS="ваш_telegram_id"

# Перевірте встановлені secrets
fly secrets list
```

### Як дізнатися свій Telegram ID:
1. Напишіть боту [@userinfobot](https://t.me/userinfobot)
2. Або використайте [@getidsbot](https://t.me/getidsbot)

## Крок 5: Деплой

```bash
# Задеплоїти додаток
fly deploy

# Перевірити статус
fly status

# Переглянути логи
fly logs
```

## Крок 6: Налаштування Telegram Bot

1. Відкрийте [@BotFather](https://t.me/BotFather) в Telegram
2. Виберіть вашого бота
3. Виберіть "Bot Settings" → "Menu Button"
4. Встановіть URL: `https://auraslots.fly.dev`

Або використайте команду:
```
/setmenubutton
```

## Крок 7: Перевірка

1. Перевірте health endpoint: https://auraslots.fly.dev/health
2. Відкрийте додаток в Telegram
3. Перевірте адмін панель (якщо ваш ID в ADMIN_IDS)

## URL для Telegram Mini App

```
https://auraslots.fly.dev
```

## Адмін панель

Доступ до адмін панелі: `https://auraslots.fly.dev/api/admin/dashboard`

Ваш Telegram ID (@BronhoFather) має бути в змінній `ADMIN_IDS`.

## Корисні команди

```bash
# Переглянути логи в реальному часі
fly logs

# Перезапустити додаток
fly apps restart auraslots

# Переглянути інформацію про додаток
fly status

# Відкрити SSH сесію
fly ssh console

# Масштабування
fly scale count 1
fly scale vm shared-cpu-1x --memory 512
```

## Troubleshooting

### Помилка при деплої
```bash
fly logs
fly status
```

### Додаток не запускається
```bash
fly ssh console
cd /app
node server.js
```

### Проблеми з базою даних
База даних зберігається в `/app/data` всередині контейнера. 
Для постійного зберігання налаштуйте volume:

```bash
fly volumes create data --size 1 --region iad
```

І додайте в `fly.toml`:
```toml
[mounts]
  source = "data"
  destination = "/app/data"
```
