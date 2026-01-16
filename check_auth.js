/**
 * Скрипт для перевірки налаштувань авторизації
 * Запустіть: node check_auth.js
 */

console.log('🔍 Перевірка налаштувань авторизації...\n');

// Інструкції
console.log('📋 Інструкції для налаштування:\n');
console.log('1. Переконайтеся, що Bot Token налаштований:');
console.log('   fly secrets set TELEGRAM_BOT_TOKEN=your_token --app auraslots\n');
console.log('2. Перевірте наявність секретів:');
console.log('   fly secrets list --app auraslots\n');
console.log('3. Налаштуйте WebApp URL в BotFather:');
console.log('   - Відкрийте @BotFather в Telegram');
console.log('   - Використайте команду /mybots');
console.log('   - Виберіть вашого бота');
console.log('   - Виберіть "Bot Settings" → "Menu Button"');
console.log('   - Встановіть URL: https://auraslots.fly.dev\n');
console.log('4. Задеплойте зміни:');
console.log('   fly deploy --app auraslots\n');
console.log('5. Перевірте логи після деплою:');
console.log('   fly logs --app auraslots\n');
console.log('6. Відкрийте міні-додаток і перевірте консоль браузера (F12)');
console.log('   Шукайте повідомлення:');
console.log('   ✅ Telegram WebApp initialized');
console.log('   ✅ User authenticated\n');
