# Встановлення секретів для Fly.io

## Команди для встановлення секретів

Відкрийте термінал (PowerShell або Command Prompt) і виконайте наступні команди:

```bash
# Перейдіть в директорію проекту
cd "D:\WorkSpace - IT\AURA"

# Встановіть токен Crypto Pay
fly secrets set CRYPTO_PAY_TOKEN=516747:AANQtO6n9SI3kBpHLKj6osKGZFvBJeMohV3 --app auraslots

# Перевірте, що секрет встановлено
fly secrets list --app auraslots
```

## Всі необхідні секрети

Якщо потрібно встановити всі секрети одночасно:

```bash
# Crypto Pay токен
fly secrets set CRYPTO_PAY_TOKEN=516747:AANQtO6n9SI3kBpHLKj6osKGZFvBJeMohV3 --app auraslots

# Telegram Bot Token (якщо ще не встановлено)
fly secrets set TELEGRAM_BOT_TOKEN=your_bot_token_here --app auraslots

# WebApp URL
fly secrets set TELEGRAM_WEBAPP_URL=https://auraslots.fly.dev --app auraslots

# Admin IDs (через кому, наприклад: 123456789,987654321)
fly secrets set ADMIN_IDS=your_telegram_id_here --app auraslots
```

## Перевірка секретів

Після встановлення перевірте:

```bash
fly secrets list --app auraslots
```

Ви повинні побачити всі встановлені секрети (значення не відображаються з міркувань безпеки).

## Важливо

⚠️ **НЕ додавайте секрети в код або в git!** Використовуйте тільки `fly secrets set` для безпечного зберігання.

## Після встановлення секретів

1. Перезапустіть додаток:
```bash
fly apps restart auraslots
```

2. Перевірте логи:
```bash
fly logs --app auraslots
```

3. Переконайтеся, що немає помилок про відсутність токенів.
