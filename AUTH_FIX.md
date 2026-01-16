# Виправлення помилки авторизації міні-додатку

## Проблема
Міні-додаток показує помилку "Unauthorized" при спробі авторизації.

## Виконані зміни

### 1. CORS налаштування (backend/server.js)
Додано підтримку кастомних заголовків для Telegram WebApp:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-telegram-init-data', 'Authorization'],
  exposedHeaders: ['x-telegram-init-data']
}));
```

### 2. Покращена обробка initData (frontend/src/utils/api.js)
- Додано підтримку глобального стану `window.__TELEGRAM_INIT_DATA__`
- Додано логування для діагностики
- Покращена обробка помилок

### 3. Покращена ініціалізація Telegram WebApp (frontend/src/App.jsx)
- Додано перевірку наявності initData
- Додано логування для діагностики
- Покращена обробка помилок авторизації

### 4. Покращений /auth endpoint (backend/routes/api.js)
- Додано підтримку initData з заголовків
- Додано детальне логування
- Покращена валідація даних

### 5. Рання ініціалізація Telegram WebApp (frontend/index.html)
- Додано скрипт для ініціалізації Telegram WebApp одразу після завантаження
- Збереження initData в глобальному стані для швидшого доступу

## Як задеплоїти зміни

1. Переконайтеся, що frontend зібрано:
```bash
cd frontend
npm run build
cd ..
```

2. Задеплойте на Fly.io:
```bash
fly deploy --app auraslots
```

## Перевірка після деплою

1. Відкрийте міні-додаток в Telegram
2. Відкрийте консоль браузера (F12) і перевірте:
   - Чи є повідомлення "✅ Telegram WebApp initialized"
   - Чи є повідомлення "✅ User authenticated"
   - Чи немає помилок "❌ Unauthorized"

3. Якщо все ще є помилки, перевірте логи на Fly.io:
```bash
fly logs --app auraslots
```

## Можливі проблеми та рішення

### Проблема: initData порожній
**Рішення:** Переконайтеся, що міні-додаток відкривається через Telegram, а не напряму в браузері.

### Проблема: "Invalid Telegram auth data"
**Рішення:** Переконайтеся, що `TELEGRAM_BOT_TOKEN` правильно налаштований в secrets:
```bash
fly secrets set TELEGRAM_BOT_TOKEN=your_token --app auraslots
```

### Проблема: "Auth data expired"
**Рішення:** Це нормально, якщо initData старіший за 24 години. Просто перезавантажте міні-додаток.

### Проблема: CORS помилки
**Рішення:** Переконайтеся, що домен міні-додатку правильно налаштований в `FRONTEND_URL` або використовується `*` для всіх джерел.

## Додаткові налаштування

Якщо проблема залишається, перевірте:

1. **Telegram Bot Token:**
```bash
fly secrets list --app auraslots
```

2. **WebApp URL в BotFather:**
   - Відкрийте BotFather в Telegram
   - Використайте команду `/mybots`
   - Виберіть вашого бота
   - Виберіть "Bot Settings" → "Menu Button"
   - Переконайтеся, що URL вказує на ваш Fly.io домен: `https://auraslots.fly.dev`

3. **Перевірка валідації:**
   - Відкрийте консоль браузера
   - Перевірте, чи `window.Telegram.WebApp.initData` не порожній
   - Перевірте, чи заголовок `x-telegram-init-data` відправляється з запитами

## Контакти для підтримки

Якщо проблема не вирішена, перевірте логи на Fly.io та зверніться до підтримки з деталями помилки.
