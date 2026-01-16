// Скрипт для отримання Telegram ID користувача @BronhoFather
const axios = require('axios');

const BOT_TOKEN = '8220670161:AAEDEyB-efY37A-1Mj0OuzJKP1YMrXscLLI';
const USERNAME = 'BronhoFather';

async function getUserId() {
  try {
    // Спробуємо отримати інформацію через getUpdates
    const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    
    if (response.data.ok && response.data.result.length > 0) {
      // Шукаємо користувача з username @BronhoFather
      for (const update of response.data.result) {
        if (update.message?.from?.username === USERNAME || 
            update.message?.from?.first_name?.includes('Bronho')) {
          console.log(`Telegram ID для @${USERNAME}: ${update.message.from.id}`);
          return update.message.from.id;
        }
      }
    }
    
    console.log('Користувач не знайдений в останніх оновленнях.');
    console.log('Напишіть боту будь-яке повідомлення, а потім запустіть цей скрипт знову.');
    console.log('Або використайте @userinfobot для отримання вашого ID.');
  } catch (error) {
    console.error('Помилка:', error.message);
  }
}

getUserId();
