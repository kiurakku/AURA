# Налаштування Crypto Pay

## 1. Додати токен до secrets

```bash
fly secrets set CRYPTO_PAY_TOKEN=516747:AANQtO6n9SI3kBpHLKj6osKGZFvBJeMohV3 --app auraslots
```

## 2. Налаштувати Webhook URL

Відкрийте @CryptoBot в Telegram:
1. Перейдіть в Crypto Pay → Мои приложения
2. Виберіть ваше приложение
3. Налаштуйте Webhook URL: `https://auraslots.fly.dev/api/payments/webhook`

## 3. Функціонал

### Депозит
- Користувач натискає "Депозит"
- Вводить суму (мінімум 1 USDT)
- Створюється інвойс через Crypto Pay
- Відкривається посилання для оплати
- Після оплати баланс автоматично поповнюється через webhook

### Виведення
- Користувач натискає "Вивести"
- Вводить суму
- Створюється запит на виведення (pending)
- Адміністратор підтверджує в адмін-панелі
- Кошти переводяться на Telegram ID користувача через Crypto Pay

## 4. API Endpoints

- `POST /api/payments/deposit` - Створити депозит
- `GET /api/payments/deposit/:invoiceId/status` - Перевірити статус депозиту
- `POST /api/payments/withdraw` - Створити запит на виведення
- `POST /api/payments/webhook` - Webhook для Crypto Pay

## 5. Перевірка після деплою

1. Перевірте, що токен налаштований:
```bash
fly secrets list --app auraslots
```

2. Перевірте логи:
```bash
fly logs --app auraslots
```

3. Протестуйте депозит через міні-додаток
