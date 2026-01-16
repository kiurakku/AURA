# Інструкції для деплою

## 1. Додати секрети

```bash
fly secrets set CRYPTO_PAY_TOKEN=516747:AANQtO6n9SI3kBpHLKj6osKGZFvBJeMohV3 --app auraslots
fly secrets set TELEGRAM_BOT_TOKEN=your_bot_token --app auraslots
fly secrets set TELEGRAM_WEBAPP_URL=https://auraslots.fly.dev --app auraslots
```

## 2. Налаштувати Webhook для Crypto Pay

1. Відкрийте @CryptoBot в Telegram
2. Перейдіть в Crypto Pay → Мои приложения
3. Виберіть ваше приложение
4. Налаштуйте Webhook URL: `https://auraslots.fly.dev/api/payments/webhook`

## 3. Задеплоїти

```bash
cd D:\WorkSpace - IT\AURA
fly deploy --app auraslots
```

## 4. Перевірити

1. Перевірте логи:
```bash
fly logs --app auraslots
```

2. Перевірте, що секрети налаштовані:
```bash
fly secrets list --app auraslots
```

3. Протестуйте міні-додаток в Telegram

## Виправлення авторизації

Авторизація вже виправлена в попередніх змінах:
- ✅ CORS налаштування для кастомних заголовків
- ✅ Покращена обробка initData
- ✅ Логування для діагностики
- ✅ Рання ініціалізація Telegram WebApp

Якщо все ще є проблеми, перевірте:
1. Чи правильно налаштований `TELEGRAM_BOT_TOKEN`
2. Чи WebApp URL в BotFather вказує на `https://auraslots.fly.dev`
3. Логи на Fly.io для деталей помилок
