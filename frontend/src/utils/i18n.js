// Internationalization (i18n) system
const translations = {
  uk: {
    // Common
    common: {
      loading: 'Завантаження...',
      error: 'Помилка',
      success: 'Успіх',
      cancel: 'Скасувати',
      confirm: 'Підтвердити',
      save: 'Зберегти',
      delete: 'Видалити',
      edit: 'Редагувати',
      close: 'Закрити'
    },
    // Navigation
    nav: {
      home: 'Головна',
      games: 'Ігри',
      wallet: 'Гаманець',
      referral: 'Реферали',
      profile: 'Профіль'
    },
    // Home
    home: {
      title: 'AURA Casino',
      subtitle: 'Найкращі ігри та найвищі виграші!',
      quickPlay: 'Швидка гра',
      categories: 'Категорії ігор',
      recentWins: 'Останні виграші',
      liveWins: 'LIVE',
      bannerNext: 'Наступний банер',
      slide: 'Слайд',
      neuralTeaserAria: 'Незабаром: нейромережа AURA',
      neuralTeaserBadge: 'Незабаром',
      neuralTeaserTitle: 'Нейромережа від AURA',
      neuralTeaserDesc: 'Готуємо персональні підказки та розумніші ігрові сценарії. Слідкуйте за оновленнями.',
    },
    // Games
    games: {
      title: 'Бібліотека ігор',
      all: 'Усі',
      slots: 'Слоти',
      table: 'Настільні',
      quick: 'Швидкі',
      favorites: 'Вибране',
      play: 'Грати',
      empty: 'Немає ігор у цій категорії',
      search: 'Пошук',
      filters: 'Фільтри',
      sortBy: 'Сортувати за',
      popular: 'Популярність',
      new: 'Нові',
      name: 'Назва',
      foundGames: 'Знайдено: {count} ігор',
      clearFilters: 'Очистити фільтри',
      soon: 'Скоро',
      gameInProgress: 'Гра в розробці. Скоро буде доступна!',
      popularity: 'Популярність',
      bet: 'Ставка',
      multiplayer: 'Мультиплеєр',
      searchPlaceholder: 'Пошук ігор...',
      gameType: 'Тип гри',
      solo: 'Соло',
      allTypes: 'Усі типи',
      backAria: 'Назад',
      betAmount: 'Сума ставки',
      autoCashoutOptional: 'Автовивід (необов’язково)',
      autoCashoutPlaceholder: 'напр. 2.00',
      autoCashoutLine: 'Автовивід: {value}x',
      betBtn: 'Зробити ставку',
      cashoutBtn: 'Забрати виграш',
      startGame: 'Почати',
      starting: 'Запуск...',
      processing: 'Обробка...',
      minesCount: 'Мін: {count}',
      minesLabel: 'Мін',
      revealedLabel: 'Відкрито',
      multiplierLabel: 'Множник',
      currentMult: 'Поточний',
      minesDemoHint: 'Демо: перегляд сітки. Відкривайте клітинки з акаунтом.',
      authError: 'Помилка авторизації',
      insufficientBalance: 'Недостатньо коштів. Мін. ставка 0.1 USDT. Поповніть баланс.',
      cashoutError: 'Помилка виводу',
      crashWon: 'Виведено! Множник: {mult}x. Виграш: {amount} USDT',
      shareWinConfirm: 'Поділитися виграшем з друзями?',
      diceWon: 'Ви виграли {amount} USDT!',
      diceLost: 'Ви програли. Результат: {result}',
      wonShort: 'виграли',
      lostShort: 'програли',
      diceBotLine: 'Результат: {result}. Ви {youStatus}, бот {botStatus}. (безкоштовно)',
      mineHit: 'Міна! Гру завершено.',
      minesWon: 'Виграш! Множник: {mult}x',
      mineSlider: 'Кількість мін: {count}',
      cellMine: 'Міна',
      cellSafe: 'Безпечно',
      cellHidden: 'Клітинка',
      gameEnded: 'Гру завершено',
      gameError: 'Помилка гри',
      botCashoutFree: 'Бот вивів на {mult}x! (безкоштовно)',
      crashTitle: 'CRASH',
      diceTitle: 'DICE',
      minesTitle: 'MINES',
      diceWinStatus: 'Виграш!',
      diceLoseStatus: 'Програш',
      diceOver: 'Більше',
      diceUnder: 'Менше',
      diceTarget: 'Ціль: {value}',
      diceRoll: 'Кинути',
      diceRolling: 'Кидок...',
      minesStartError: 'Не вдалося почати гру',
      minesRevealError: 'Помилка відкриття',
      minesCashout: 'Вивести',
      minesCashedOut: 'Виведено! Множник: {mult}x',
      minesDemoCashout: 'Демо: умовний вивід ~{mult}x (без балансу).',
      minesOpenedLabel: 'Відкрито',
    },
    leaderboard: {
      title: 'Рейтинг гравців',
      day: 'День',
      week: 'Тиждень',
      all: 'Весь час',
      periodDay: 'Сьогодні',
      periodWeek: 'Цей тиждень',
      periodAll: 'За весь час',
      loading: 'Завантаження...',
      empty: 'Поки що немає виграшів',
      emptyHint: 'Станьте першим у таблиці!',
      won: 'Виграно',
      rank: 'Ранг',
    },
    // Online Games
    onlineGames: {
      title: 'Онлайн ігри',
      subtitle: 'Змагайся з іншими гравцями в реальному часі або грай з ботами безкоштовно!',
      activeRooms: 'Активні кімнати',
      availableGames: 'Доступні ігри',
      waiting: 'Очікування',
      playing: 'Гра',
      join: 'Приєднатися',
      full: 'Повна',
      createRoom: 'Створити кімнату',
      playWithBot: 'Грати з ботом',
      playWithBotFree: 'Гра з ботом (безкоштовно)',
      minBet: 'Мін. ставка',
      players: 'Гравців',
      upTo: 'до',
      crashBot: 'Crash з ботом',
      crashBotDesc: 'Грай Crash з ботом безкоштовно',
      diceBot: 'Dice з ботом',
      diceBotDesc: 'Грай Dice з ботом безкоштовно',
      minesBot: 'Mines з ботом',
      minesBotDesc: 'Грай Mines з ботом безкоштовно',
      telegramBattle: 'Telegram Battle',
      telegramBattleDesc: 'Битва між гравцями в реальному часі',
      cyberCrash: 'Cyber Crash',
      cyberCrashDesc: 'Crash з іншими гравцями',
      frostDice: 'Frost Dice',
      frostDiceDesc: 'Dice в арктичному стилі',
      neonRoulette: 'Neon Roulette',
      neonRouletteDesc: 'Рулетка з неоновими ефектами',
      backToOnlineGames: 'Назад до онлайн ігор',
      botGameTitle: '🤖 Гра з ботом (безкоштовно)',
      botGameDesc: 'Ви граєте з ботом безкоштовно. Гроші не списуються та не нараховуються.',
      joinError: 'Помилка підключення',
      createError: 'Помилка створення кімнати',
      waitingPlayers: 'Очікування гравців...',
      gameInProgress: 'Гра в процесі',
      status: 'Статус',
      bet: 'Ставка',
      gameStarted: 'Гра розпочата!',
      startGameError: 'Помилка запуску гри',
      startGame: 'Розпочати гру',
      ready: 'Готовий',
      notReady: 'Не готовий',
      gameFinished: 'Гра завершена',
      connectionError: 'Помилка підключення'
    },
    // Wallet
    wallet: {
      title: 'Гаманець',
      balance: 'Ваш баланс',
      mainBalance: 'Основний',
      bonusBalance: 'Бонус',
      total: 'Всього',
      deposit: 'Поповнити',
      withdraw: 'Вивести',
      currency: 'Вибір валюти',
      cryptocurrencies: 'Криптовалюти',
      bonusCoins: 'Бонусні монети',
      bonusCoinsDescription: 'Системні валюти для покращення ігрового досвіду',
      withdrawSection: 'Вивести кошти',
      amount: 'Сума',
      address: 'Адреса гаманця',
      enterAddress: 'Введіть адресу {currency} гаманця',
      processing: 'Обробка...',
      transactions: 'Історія транзакцій',
      empty: 'Немає транзакцій',
      depositSoon: 'Функція депозиту буде доступна після налаштування платіжного шлюзу',
      fillAllFields: 'Заповніть всі поля',
      withdrawSoon: 'Функція виводу буде доступна після налаштування платіжного шлюзу',
      withdrawError: 'Помилка виводу'
    },
    // Profile
    profile: {
      title: 'Профіль',
      stats: 'Статистика',
      settings: 'Налаштування',
      history: 'Історія ігор',
      soundEffects: 'Звукові ефекти',
      soundEffectsDesc: 'Увімкнути звуки гри',
      notifications: 'Сповіщення в бот',
      notificationsDesc: 'Отримувати сповіщення про виграші',
      language: 'Мова',
      privacy: 'Конфіденційність',
      wallets: 'Прив\'язані гаманці',
      support: 'Підтримка 24/7',
      empty: 'Немає ігор',
      appearance: 'Зовнішній вигляд',
      animations: 'Анімації',
      animationsDesc: 'Увімкнути анімації та переходи',
      reducedMotion: 'Зменшений рух',
      reducedMotionDesc: 'Зменшити анімації для кращої продуктивності',
      fontSize: 'Розмір тексту',
      fontSizeDesc: 'Налаштувати розмір шрифту',
      small: 'Малий',
      normal: 'Нормальний',
      large: 'Великий',
      compactMode: 'Компактний режим',
      compactModeDesc: 'Зменшити відступи та розміри елементів',
      audioNotifications: 'Аудіо та сповіщення',
      hapticFeedback: 'Тактильний відгук',
      hapticFeedbackDesc: 'Вібрація при взаємодії',
      gameSettings: 'Налаштування гри',
      autoPlay: 'Автогра',
      autoPlayDesc: 'Автоматично продовжувати гру',
      showBalance: 'Показувати баланс',
      showBalanceDesc: 'Відображати баланс у верхній панелі',
      privacyTitle: 'Налаштування конфіденційності',
      showBalancePrivacy: 'Показувати баланс',
      showBalancePrivacyDesc: 'Дозволити іншим бачити ваш баланс',
      showStatsPrivacy: 'Показувати статистику',
      showStatsPrivacyDesc: 'Дозволити іншим бачити вашу статистику',
      allowReferrals: 'Дозволити реферали',
      allowReferralsDesc: 'Дозволити іншим запрошувати вас через реферальні посилання',
      dataSharing: 'Обмін даними',
      dataSharingDesc: 'Дозволити обмін анонімними даними для покращення сервісу'
    },
    // Referral
    referral: {
      title: 'Реферальна програма',
      subtitle: 'Заробляйте разом з друзями!',
      friends: 'Друзів',
      earnings: 'Ваш дохід',
      percent: '% від ставок',
      link: 'Ваше реферальне посилання',
      copy: 'Копіювати',
      copied: 'Скопійовано',
      invite: 'Запросити друзів',
      howItWorks: 'Як це працює?'
    },
    // Legal Documents
    legal: {
      privacy: {
        title: 'Політика конфіденційності',
        content: `Політика конфіденційності AURA Casino

1. Збір інформації
Ми збираємо мінімальну необхідну інформацію для роботи сервісу:
- Telegram ID та username
- Історія транзакцій
- Ігрова статистика

2. Використання даних
Ваші дані використовуються виключно для:
- Надання послуг казино
- Обробки транзакцій
- Покращення сервісу

3. Захист даних
Всі дані захищені сучасними методами шифрування.
Ми не передаємо ваші дані третім особам без вашої згоди.

4. Ваші права
Ви маєте право:
- Отримати копію ваших даних
- Видалити ваші дані
- Відкликати згоду на обробку

Дата оновлення: ${new Date().toLocaleDateString('uk-UA')}`
      },
      terms: {
        title: 'Правила платформи',
        content: `Правила платформи AURA Casino

1. Загальні положення
AURA Casino - це платформа для розваг та ігор.
Мінімальний вік: 18 років.

2. Правила гри
- Всі ігри працюють на принципі Provably Fair
- Мінімальна ставка: 0.1 USDT
- Максимальна ставка: 1000 USDT

3. Транзакції
- Депозити обробляються автоматично
- Виводи до 50 USDT - автоматично
- Виводи понад 50 USDT - ручне підтвердження

4. Заборонено
- Використання ботів та скриптів
- Обхід системи безпеки
- Шахрайство та маніпуляції

5. Санкції
За порушення правил:
- Попередження
- Тимчасове блокування
- Постійне блокування

Дата оновлення: ${new Date().toLocaleDateString('uk-UA')}`
      },
      agreement: {
        title: 'Умови користувацької згоди',
        content: `Умови користувацької згоди AURA Casino

Приймаючи ці умови, ви підтверджуєте:

1. Вік та правомочність
- Вам виповнилося 18 років
- Ви маєте право укладати угоди

2. Розуміння ризиків
- Гра в казино може призвести до втрати коштів
- Ви граєте на свій ризик
- Ми не несемо відповідальності за ваші втрати

3. Відповідальність
- Ви несете повну відповідальність за свої дії
- Заборонено грати під впливом алкоголю/наркотиків
- Рекомендуємо грати відповідально

4. Згода на обробку даних
- Ви згодні на обробку ваших персональних даних
- Ви згодні отримувати сповіщення
- Ви можете відкликати згоду в будь-який час

5. Зміни умов
Ми залишаємо за собою право змінювати умови.
Про зміни буде повідомлено завчасно.

Дата оновлення: ${new Date().toLocaleDateString('uk-UA')}`
      },
      commission: {
        title: 'Комісії та витрати',
        content: `Комісії та витрати AURA Casino

1. Комісія платформи
- PvP ігри: 5% комісія з банку
- Соло ігри: Без комісії
- Виведення коштів: Без комісії

2. Мінімальні суми
- Мінімальна ставка: 0.1 USDT
- Мінімальне поповнення: 1 USDT
- Мінімальне виведення: 1 USDT

3. Обробка транзакцій
- Депозити: Миттєво (через Crypto Pay)
- Виводи до 50 USDT: Автоматично (до 24 годин)
- Виводи понад 50 USDT: Ручне підтвердження (до 48 годин)

4. Комісії мережі
- USDT (TRC-20): Без комісії
- TON: Комісія мережі TON
- BTC: Комісія мережі Bitcoin

5. Обмін валют
- Конвертація валют: Без додаткових комісій
- Курси обміну оновлюються автоматично

Дата оновлення: ${new Date().toLocaleDateString('uk-UA')}`
      },
      bonuses: {
        title: 'Бонуси та монети',
        content: `Бонуси та монети AURA Casino

1. Бонусні монети

🎲 CHANCE (Шанс)
- Що це: Монета, що збільшує шанс на виграш
- Як отримати: За реєстрацію через реферальне посилання (випадковий бонус)
- Як використовувати: Автоматично застосовується під час гри
- Ефект: Збільшує ймовірність виграшу на 5-10%

Ω OMEGA (Омега)
- Що це: Монета-множник бонусів
- Як отримати: За реєстрацію через реферальне посилання (випадковий бонус)
- Як використовувати: Автоматично застосовується під час гри
- Ефект: Примножує бонусні виплати на 20-50%

🪙 UNPL (Внутрішня валюта)
- Що це: Внутрішня валюта казино та проектів ARS7
- Як отримати: За реєстрацію через реферальне посилання (випадковий бонус)
- Як використовувати: Можна обміняти на USDT або використати в інших проектах ARS7
- Ефект: Універсальна валюта екосистеми

2. Реферальна система

Як працює:
- Коли новий користувач реєструється через ваше реферальне посилання, ви отримуєте випадковий бонус
- Шанси на отримання бонусів:
  * 5% - 1 монета Chance
  * 5% - 2 монети Chance
  * 20% - 0.5 монети Omega
  * 40% - 0.002 монети UNPL
  * 15% - 0.002 USDT
  * 10% - 0.002 TON
  * 5% - 0.000002 BTC

3. Вітальний бонус
- Новий користувач отримує 1 USDT на бонусний баланс при реєстрації через реферальне посилання

4. Щоденний бонус
- Команда /bonus в боті дає 1 USDT на бонусний баланс один раз на день

5. Cashback
- Автоматичний повернення частини ставок на бонусний баланс
- Розмір cashback залежить від вашого рангу

Дата оновлення: ${new Date().toLocaleDateString('uk-UA')}`
      }
    }
  },
  ru: {
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успех',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      close: 'Закрыть'
    },
    nav: {
      home: 'Главная',
      games: 'Игры',
      wallet: 'Кошелек',
      referral: 'Рефералы',
      profile: 'Профиль'
    },
    home: {
      title: 'AURA Casino',
      subtitle: 'Лучшие игры и самые высокие выигрыши!',
      quickPlay: 'Быстрая игра',
      categories: 'Категории игр',
      recentWins: 'Последние выигрыши',
      liveWins: 'LIVE'
    },
    games: {
      title: 'Библиотека игр',
      all: 'Все',
      slots: 'Слоты',
      table: 'Настольные',
      quick: 'Быстрые',
      favorites: 'Избранное',
      play: 'Играть',
      empty: 'Нет игр в этой категории',
      search: 'Поиск',
      filters: 'Фильтры',
      sortBy: 'Сортировать по',
      popular: 'Популярность',
      new: 'Новые',
      name: 'Название',
      foundGames: 'Найдено: {count} игр',
      clearFilters: 'Очистить фильтры',
      soon: 'Скоро',
      gameInProgress: 'Игра в разработке. Скоро будет доступна!',
      popularity: 'Популярность',
      bet: 'Ставка',
      multiplayer: 'Мультиплеер',
      searchPlaceholder: 'Поиск игр...',
      gameType: 'Тип игры',
      solo: 'Соло',
      allTypes: 'Все типы'
    },
    wallet: {
      title: 'Кошелек',
      balance: 'Ваш баланс',
      mainBalance: 'Основной',
      bonusBalance: 'Бонус',
      total: 'Всего',
      deposit: 'Пополнить',
      withdraw: 'Вывести',
      currency: 'Выбор валюты',
      cryptocurrencies: 'Криптовалюты',
      bonusCoins: 'Бонусные монеты',
      bonusCoinsDescription: 'Системные валюты для улучшения игрового опыта',
      withdrawSection: 'Вывести средства',
      amount: 'Сумма',
      address: 'Адрес кошелька',
      enterAddress: 'Введите адрес {currency} кошелька',
      processing: 'Обработка...',
      transactions: 'История транзакций',
      empty: 'Нет транзакций',
      depositSoon: 'Функция депозита будет доступна после настройки платежного шлюза',
      fillAllFields: 'Заполните все поля',
      withdrawSoon: 'Функция вывода будет доступна после настройки платежного шлюза',
      withdrawError: 'Ошибка вывода'
    },
    profile: {
      title: 'Профиль',
      stats: 'Статистика',
      settings: 'Настройки',
      history: 'История игр',
      soundEffects: 'Звуковые эффекты',
      notifications: 'Уведомления в боте',
      language: 'Язык',
      privacy: 'Конфиденциальность',
      wallets: 'Привязанные кошельки',
      support: 'Поддержка 24/7',
      empty: 'Нет игр'
    },
    referral: {
      title: 'Реферальная программа',
      subtitle: 'Зарабатывайте вместе с друзьями!',
      friends: 'Друзей',
      earnings: 'Ваш доход',
      percent: '% от ставок',
      link: 'Ваша реферальная ссылка',
      copy: 'Копировать',
      copied: 'Скопировано',
      invite: 'Пригласить друзей',
      howItWorks: 'Как это работает?'
    },
    legal: {
      privacy: {
        title: 'Политика конфиденциальности',
        content: `Политика конфиденциальности AURA Casino

1. Сбор информации
Мы собираем минимальную необходимую информацию для работы сервиса:
- Telegram ID и username
- История транзакций
- Игровая статистика

2. Использование данных
Ваши данные используются исключительно для:
- Предоставления услуг казино
- Обработки транзакций
- Улучшения сервиса

3. Защита данных
Все данные защищены современными методами шифрования.
Мы не передаем ваши данные третьим лицам без вашего согласия.

4. Ваши права
Вы имеете право:
- Получить копию ваших данных
- Удалить ваши данные
- Отозвать согласие на обработку

Дата обновления: ${new Date().toLocaleDateString('ru-RU')}`
      },
      terms: {
        title: 'Правила платформы',
        content: `Правила платформы AURA Casino

1. Общие положения
AURA Casino - это платформа для развлечений и игр.
Минимальный возраст: 18 лет.

2. Правила игры
- Все игры работают на принципе Provably Fair
- Минимальная ставка: 0.1 USDT
- Максимальная ставка: 1000 USDT

3. Транзакции
- Депозиты обрабатываются автоматически
- Выводы до 50 USDT - автоматически
- Выводы свыше 50 USDT - ручное подтверждение

4. Запрещено
- Использование ботов и скриптов
- Обход системы безопасности
- Мошенничество и манипуляции

5. Санкции
За нарушение правил:
- Предупреждение
- Временная блокировка
- Постоянная блокировка

Дата обновления: ${new Date().toLocaleDateString('ru-RU')}`
      },
      agreement: {
        title: 'Условия пользовательского согласия',
        content: `Условия пользовательского согласия AURA Casino

Принимая эти условия, вы подтверждаете:

1. Возраст и правомочность
- Вам исполнилось 18 лет
- Вы имеете право заключать договоры

2. Понимание рисков
- Игра в казино может привести к потере средств
- Вы играете на свой риск
- Мы не несем ответственности за ваши потери

3. Ответственность
- Вы несете полную ответственность за свои действия
- Запрещено играть под влиянием алкоголя/наркотиков
- Рекомендуем играть ответственно

4. Согласие на обработку данных
- Вы согласны на обработку ваших персональных данных
- Вы согласны получать уведомления
- Вы можете отозвать согласие в любое время

5. Изменения условий
Мы оставляем за собой право изменять условия.
Об изменениях будет сообщено заблаговременно.

Дата обновления: ${new Date().toLocaleDateString('ru-RU')}`
      },
      commission: {
        title: 'Комиссии и расходы',
        content: `Комиссии и расходы AURA Casino

1. Комиссия платформы
- PvP игры: 5% комиссия с банка
- Соло игры: Без комиссии
- Вывод средств: Без комиссии

2. Минимальные суммы
- Минимальная ставка: 0.1 USDT
- Минимальное пополнение: 1 USDT
- Минимальный вывод: 1 USDT

3. Обработка транзакций
- Депозиты: Мгновенно (через Crypto Pay)
- Выводы до 50 USDT: Автоматически (до 24 часов)
- Выводы свыше 50 USDT: Ручное подтверждение (до 48 часов)

4. Комиссии сети
- USDT (TRC-20): Без комиссии
- TON: Комиссия сети TON
- BTC: Комиссия сети Bitcoin

5. Обмен валют
- Конвертация валют: Без дополнительных комиссий
- Курсы обмена обновляются автоматически

Дата обновления: ${new Date().toLocaleDateString('ru-RU')}`
      },
      bonuses: {
        title: 'Бонусы и монеты',
        content: `Бонусы и монеты AURA Casino

1. Бонусные монеты

🎲 CHANCE (Шанс)
- Что это: Монета, которая увеличивает шанс на выигрыш
- Как получить: За регистрацию через реферальную ссылку (случайный бонус)
- Как использовать: Автоматически применяется во время игры
- Эффект: Увеличивает вероятность выигрыша на 5-10%

Ω OMEGA (Омега)
- Что это: Монета-множитель бонусов
- Как получить: За регистрацию через реферальную ссылку (случайный бонус)
- Как использовать: Автоматически применяется во время игры
- Эффект: Умножает бонусные выплаты на 20-50%

🪙 UNPL (Внутренняя валюта)
- Что это: Внутренняя валюта казино и проектов ARS7
- Как получить: За регистрацию через реферальную ссылку (случайный бонус)
- Как использовать: Можно обменять на USDT или использовать в других проектах ARS7
- Эффект: Универсальная валюта экосистемы

2. Реферальная система

Как работает:
- Когда новый пользователь регистрируется по вашей реферальной ссылке, вы получаете случайный бонус
- Шансы на получение бонусов:
  * 5% - 1 монета Chance
  * 5% - 2 монеты Chance
  * 20% - 0.5 монеты Omega
  * 40% - 0.002 монеты UNPL
  * 15% - 0.002 USDT
  * 10% - 0.002 TON
  * 5% - 0.000002 BTC

3. Приветственный бонус
- Новый пользователь получает 1 USDT на бонусный баланс при регистрации через реферальную ссылку

4. Ежедневный бонус
- Команда /bonus в боте дает 1 USDT на бонусный баланс один раз в день

5. Cashback
- Автоматическое возвращение части ставок на бонусный баланс
- Размер cashback зависит от вашего ранга

Дата обновления: ${new Date().toLocaleDateString('ru-RU')}`
      }
    }
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close'
    },
    nav: {
      home: 'Home',
      games: 'Games',
      wallet: 'Wallet',
      referral: 'Referrals',
      profile: 'Profile'
    },
    home: {
      title: 'AURA Casino',
      subtitle: 'Best games and highest wins!',
      quickPlay: 'Quick Play',
      categories: 'Game Categories',
      recentWins: 'Recent Wins',
      liveWins: 'LIVE',
      bannerNext: 'Next banner',
      slide: 'Slide',
      neuralTeaserAria: 'Coming soon: AURA neural features',
      neuralTeaserBadge: 'Coming soon',
      neuralTeaserTitle: 'Neural layer by AURA',
      neuralTeaserDesc: 'We are preparing personalized hints and smarter game flows. Stay tuned.',
    },
    games: {
      title: 'Games Library',
      all: 'All',
      slots: 'Slots',
      table: 'Table',
      quick: 'Quick',
      favorites: 'Favorites',
      play: 'Play',
      empty: 'No games in this category',
      search: 'Search',
      filters: 'Filters',
      sortBy: 'Sort by',
      popular: 'Popularity',
      new: 'New',
      name: 'Name',
      foundGames: 'Found: {count} games',
      clearFilters: 'Clear filters',
      soon: 'Soon',
      gameInProgress: 'This game is in development. Coming soon!',
      popularity: 'Popularity',
      bet: 'Bet',
      multiplayer: 'Multiplayer',
      searchPlaceholder: 'Search games...',
      gameType: 'Game type',
      solo: 'Solo',
      allTypes: 'All types',
      backAria: 'Back',
      betAmount: 'Bet amount',
      autoCashoutOptional: 'Auto cashout (optional)',
      autoCashoutPlaceholder: 'e.g. 2.00',
      autoCashoutLine: 'Auto cashout: {value}x',
      betBtn: 'Place bet',
      cashoutBtn: 'Cash out',
      startGame: 'Start',
      starting: 'Starting...',
      processing: 'Processing...',
      minesCount: 'Mines: {count}',
      minesLabel: 'Mines',
      revealedLabel: 'Revealed',
      multiplierLabel: 'Multiplier',
      currentMult: 'Current',
      minesDemoHint: 'Demo: grid preview. Tap cells with your account.',
      authError: 'Auth error',
      insufficientBalance: 'Insufficient balance. Min bet 0.1 USDT. Top up to continue.',
      cashoutError: 'Cashout error',
      crashWon: 'Cashed out! Multiplier: {mult}x. Win: {amount} USDT',
      shareWinConfirm: 'Share your win with friends?',
      diceWon: 'You won {amount} USDT!',
      diceLost: 'You lost. Result: {result}',
      wonShort: 'won',
      lostShort: 'lost',
      diceBotLine: 'Result: {result}. You {youStatus}, bot {botStatus}. (Free play)',
      mineHit: 'You hit a mine! Game over.',
      minesWon: 'You won! Multiplier: {mult}x',
      mineSlider: 'Mines: {count}',
      cellMine: 'Mine',
      cellSafe: 'Safe',
      cellHidden: 'Cell',
      gameEnded: 'Game ended',
      gameError: 'Game error',
      botCashoutFree: 'Bot cashed out at {mult}x! (Free play)',
      crashTitle: 'CRASH',
      diceTitle: 'DICE',
      minesTitle: 'MINES',
      diceWinStatus: 'Win!',
      diceLoseStatus: 'Loss',
      diceOver: 'Over',
      diceUnder: 'Under',
      diceTarget: 'Target: {value}',
      diceRoll: 'Roll',
      diceRolling: 'Rolling...',
      minesStartError: 'Failed to start game',
      minesRevealError: 'Reveal error',
      minesCashout: 'Cash out',
      minesCashedOut: 'You cashed out! Multiplier: {mult}x',
      minesDemoCashout: 'Demo: hypothetical cashout ~{mult}x (no balance change).',
      minesOpenedLabel: 'Opened',
    },
    onlineGames: {
      title: 'Online games',
      subtitle: 'Play against others in real time or vs bots for free!',
      activeRooms: 'Active rooms',
      availableGames: 'Available games',
      waiting: 'Waiting',
      playing: 'Playing',
      join: 'Join',
      full: 'Full',
      createRoom: 'Create room',
      playWithBot: 'Play with bot',
      playWithBotFree: 'Bot game (free)',
      minBet: 'Min. bet',
      players: 'Players',
      upTo: 'up to',
      backToOnlineGames: 'Back to online games',
      botGameTitle: 'Bot game (free)',
      botGameDesc: 'You play for free. No real balance charged or credited.',
      joinError: 'Join error',
      createError: 'Create room error',
      waitingPlayers: 'Waiting for players...',
      gameInProgress: 'Game in progress',
      status: 'Status',
      bet: 'Bet',
      gameStarted: 'Game started!',
      startGameError: 'Start game error',
      startGame: 'Start game',
      ready: 'Ready',
      notReady: 'Not ready',
      gameFinished: 'Game finished',
      connectionError: 'Connection error',
    },
    leaderboard: {
      title: 'Player ranking',
      day: 'Day',
      week: 'Week',
      all: 'All time',
      periodDay: 'Today',
      periodWeek: 'This week',
      periodAll: 'All time',
      loading: 'Loading...',
      empty: 'No wins yet',
      emptyHint: 'Be the first on the board!',
      won: 'Won',
      rank: 'Rank',
    },
    wallet: {
      title: 'Wallet',
      balance: 'Your Balance',
      mainBalance: 'Main',
      bonusBalance: 'Bonus',
      total: 'Total',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      currency: 'Currency Selection',
      cryptocurrencies: 'Cryptocurrencies',
      bonusCoins: 'Bonus Coins',
      bonusCoinsDescription: 'System currencies to enhance gaming experience',
      withdrawSection: 'Withdraw Funds',
      amount: 'Amount',
      address: 'Wallet Address',
      enterAddress: 'Enter {currency} wallet address',
      processing: 'Processing...',
      transactions: 'Transaction History',
      empty: 'No transactions',
      depositSoon: 'Deposit function will be available after payment gateway setup',
      fillAllFields: 'Please fill all fields',
      withdrawSoon: 'Withdraw function will be available after payment gateway setup',
      withdrawError: 'Withdraw error'
    },
    profile: {
      title: 'Profile',
      stats: 'Statistics',
      settings: 'Settings',
      history: 'Game History',
      soundEffects: 'Sound Effects',
      soundEffectsDesc: 'Enable game sounds',
      notifications: 'Bot Notifications',
      notificationsDesc: 'Receive notifications about wins',
      language: 'Language',
      privacy: 'Privacy',
      wallets: 'Connected Wallets',
      support: 'Support 24/7',
      empty: 'No games',
      appearance: 'Appearance',
      animations: 'Animations',
      animationsDesc: 'Enable animations and transitions',
      reducedMotion: 'Reduced Motion',
      reducedMotionDesc: 'Reduce animations for better performance',
      fontSize: 'Font Size',
      fontSizeDesc: 'Adjust font size',
      small: 'Small',
      normal: 'Normal',
      large: 'Large',
      compactMode: 'Compact Mode',
      compactModeDesc: 'Reduce spacing and element sizes',
      audioNotifications: 'Audio & Notifications',
      hapticFeedback: 'Haptic Feedback',
      hapticFeedbackDesc: 'Vibration on interaction',
      gameSettings: 'Game Settings',
      autoPlay: 'Auto Play',
      autoPlayDesc: 'Automatically continue playing',
      showBalance: 'Show Balance',
      showBalanceDesc: 'Display balance in top panel',
      privacyTitle: 'Privacy Settings',
      showBalancePrivacy: 'Show Balance',
      showBalancePrivacyDesc: 'Allow others to see your balance',
      showStatsPrivacy: 'Show Statistics',
      showStatsPrivacyDesc: 'Allow others to see your statistics',
      allowReferrals: 'Allow Referrals',
      allowReferralsDesc: 'Allow others to invite you via referral links',
      dataSharing: 'Data Sharing',
      dataSharingDesc: 'Allow anonymous data sharing to improve service'
    },
    referral: {
      title: 'Referral Program',
      subtitle: 'Earn together with friends!',
      friends: 'Friends',
      earnings: 'Your Earnings',
      percent: '% from bets',
      link: 'Your Referral Link',
      copy: 'Copy',
      copied: 'Copied',
      invite: 'Invite Friends',
      howItWorks: 'How it works?'
    }
  },
  zh: {
    common: {
      loading: '加载中...',
      error: '错误',
      success: '成功',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      close: '关闭'
    },
    nav: {
      home: '首页',
      games: '游戏',
      wallet: '钱包',
      referral: '推荐',
      profile: '个人资料'
    },
    home: {
      title: 'AURA Casino',
      subtitle: '最佳游戏和最高奖金！',
      quickPlay: '快速游戏',
      categories: '游戏类别',
      recentWins: '最近获胜',
      liveWins: 'LIVE'
    },
    games: {
      title: '游戏库',
      all: '全部',
      slots: '老虎机',
      table: '桌面',
      quick: '快速',
      favorites: '收藏',
      play: '玩',
      empty: '此类别中没有游戏',
      search: '搜索',
      filters: '筛选',
      sortBy: '排序方式',
      popular: '人气',
      new: '最新',
      name: '名称',
      foundGames: '找到: {count} 个游戏',
      clearFilters: '清除筛选',
      soon: '即将推出',
      gameInProgress: '游戏开发中。即将推出！',
      popularity: '人气',
      bet: '投注',
      multiplayer: '多人游戏',
      searchPlaceholder: '搜索游戏...',
      gameType: '游戏类型',
      solo: '单人',
      allTypes: '所有类型'
    },
    wallet: {
      title: '钱包',
      balance: '您的余额',
      mainBalance: '主余额',
      bonusBalance: '奖金',
      total: '总计',
      deposit: '充值',
      withdraw: '提现',
      currency: '货币选择',
      cryptocurrencies: '加密货币',
      bonusCoins: '奖金币',
      bonusCoinsDescription: '系统货币以增强游戏体验',
      withdrawSection: '提取资金',
      amount: '金额',
      address: '钱包地址',
      enterAddress: '输入{currency}钱包地址',
      processing: '处理中...',
      transactions: '交易历史',
      empty: '没有交易',
      depositSoon: '存款功能将在支付网关设置后可用',
      fillAllFields: '请填写所有字段',
      withdrawSoon: '提现功能将在支付网关设置后可用',
      withdrawError: '提现错误'
    },
    profile: {
      title: '个人资料',
      stats: '统计',
      settings: '设置',
      history: '游戏历史',
      soundEffects: '音效',
      soundEffectsDesc: '启用游戏声音',
      notifications: '机器人通知',
      notificationsDesc: '接收获胜通知',
      language: '语言',
      privacy: '隐私',
      wallets: '已连接钱包',
      support: '24/7 支持',
      empty: '没有游戏',
      appearance: '外观',
      animations: '动画',
      animationsDesc: '启用动画和过渡',
      reducedMotion: '减少动作',
      reducedMotionDesc: '减少动画以提高性能',
      fontSize: '字体大小',
      fontSizeDesc: '调整字体大小',
      small: '小',
      normal: '正常',
      large: '大',
      compactMode: '紧凑模式',
      compactModeDesc: '减少间距和元素大小',
      audioNotifications: '音频和通知',
      hapticFeedback: '触觉反馈',
      hapticFeedbackDesc: '交互时振动',
      gameSettings: '游戏设置',
      autoPlay: '自动播放',
      autoPlayDesc: '自动继续游戏',
      showBalance: '显示余额',
      showBalanceDesc: '在顶部面板显示余额'
    },
    referral: {
      title: '推荐计划',
      subtitle: '与朋友一起赚钱！',
      friends: '朋友',
      earnings: '您的收入',
      percent: '% 来自投注',
      link: '您的推荐链接',
      copy: '复制',
      copied: '已复制',
      invite: '邀请朋友',
      howItWorks: '如何运作？'
    }
  },
  de: {
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      close: 'Schließen'
    },
    nav: {
      home: 'Startseite',
      games: 'Spiele',
      wallet: 'Geldbörse',
      referral: 'Empfehlungen',
      profile: 'Profil'
    },
    home: {
      title: 'AURA Casino',
      subtitle: 'Beste Spiele und höchste Gewinne!',
      quickPlay: 'Schnelles Spiel',
      categories: 'Spielkategorien',
      recentWins: 'Letzte Gewinne',
      liveWins: 'LIVE'
    },
    games: {
      title: 'Spielebibliothek',
      all: 'Alle',
      slots: 'Slots',
      table: 'Tisch',
      quick: 'Schnell',
      favorites: 'Favoriten',
      play: 'Spielen',
      empty: 'Keine Spiele in dieser Kategorie'
    },
    wallet: {
      title: 'Geldbörse',
      balance: 'Ihr Guthaben',
      mainBalance: 'Haupt',
      bonusBalance: 'Bonus',
      total: 'Gesamt',
      deposit: 'Einzahlen',
      withdraw: 'Abheben',
      currency: 'Währungsauswahl',
      cryptocurrencies: 'Kryptowährungen',
      bonusCoins: 'Bonusmünzen',
      bonusCoinsDescription: 'Systemwährungen zur Verbesserung des Spielerlebnisses',
      withdrawSection: 'Mittel abheben',
      amount: 'Betrag',
      address: 'Brieftaschenadresse',
      enterAddress: 'Geben Sie die {currency} Brieftaschenadresse ein',
      processing: 'Wird verarbeitet...',
      transactions: 'Transaktionsverlauf',
      empty: 'Keine Transaktionen',
      depositSoon: 'Einzahlungsfunktion wird nach Einrichtung des Zahlungsgateways verfügbar sein',
      fillAllFields: 'Bitte füllen Sie alle Felder aus',
      withdrawSoon: 'Auszahlungsfunktion wird nach Einrichtung des Zahlungsgateways verfügbar sein',
      withdrawError: 'Auszahlungsfehler'
    },
    profile: {
      title: 'Profil',
      stats: 'Statistiken',
      settings: 'Einstellungen',
      history: 'Spielverlauf',
      soundEffects: 'Soundeffekte',
      soundEffectsDesc: 'Spielsounds aktivieren',
      notifications: 'Bot-Benachrichtigungen',
      notificationsDesc: 'Benachrichtigungen über Gewinne erhalten',
      language: 'Sprache',
      privacy: 'Datenschutz',
      wallets: 'Verbundene Geldbörsen',
      support: 'Support 24/7',
      empty: 'Keine Spiele',
      appearance: 'Erscheinungsbild',
      animations: 'Animationen',
      animationsDesc: 'Animationen und Übergänge aktivieren',
      reducedMotion: 'Reduzierte Bewegung',
      reducedMotionDesc: 'Animationen für bessere Leistung reduzieren',
      fontSize: 'Schriftgröße',
      fontSizeDesc: 'Schriftgröße anpassen',
      small: 'Klein',
      normal: 'Normal',
      large: 'Groß',
      compactMode: 'Kompaktmodus',
      compactModeDesc: 'Abstände und Elementgrößen reduzieren',
      audioNotifications: 'Audio & Benachrichtigungen',
      hapticFeedback: 'Haptisches Feedback',
      hapticFeedbackDesc: 'Vibration bei Interaktion',
      gameSettings: 'Spieleinstellungen',
      autoPlay: 'Automatisches Spielen',
      autoPlayDesc: 'Automatisch weiterspielen',
      showBalance: 'Saldo anzeigen',
      showBalanceDesc: 'Saldo in oberer Leiste anzeigen'
    },
    referral: {
      title: 'Empfehlungsprogramm',
      subtitle: 'Verdienen Sie zusammen mit Freunden!',
      friends: 'Freunde',
      earnings: 'Ihr Verdienst',
      percent: '% von Wetten',
      link: 'Ihr Empfehlungslink',
      copy: 'Kopieren',
      copied: 'Kopiert',
      invite: 'Freunde einladen',
      howItWorks: 'Wie funktioniert es?'
    }
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar'
    },
    nav: {
      home: 'Inicio',
      games: 'Juegos',
      wallet: 'Billetera',
      referral: 'Referidos',
      profile: 'Perfil'
    },
    home: {
      title: 'AURA Casino',
      subtitle: '¡Mejores juegos y mayores ganancias!',
      quickPlay: 'Juego Rápido',
      categories: 'Categorías de Juegos',
      recentWins: 'Ganancias Recientes',
      liveWins: 'LIVE'
    },
    games: {
      title: 'Biblioteca de Juegos',
      all: 'Todos',
      slots: 'Tragamonedas',
      table: 'Mesa',
      quick: 'Rápido',
      favorites: 'Favoritos',
      play: 'Jugar',
      empty: 'No hay juegos en esta categoría',
      search: 'Buscar',
      filters: 'Filtros',
      sortBy: 'Ordenar por',
      popular: 'Popularidad',
      new: 'Nuevos',
      name: 'Nombre',
      foundGames: 'Encontrados: {count} juegos',
      clearFilters: 'Limpiar filtros',
      soon: 'Próximamente',
      gameInProgress: 'Juego en desarrollo. ¡Próximamente!',
      popularity: 'Popularidad',
      bet: 'Apuesta',
      multiplayer: 'Multijugador',
      searchPlaceholder: 'Buscar juegos...',
      gameType: 'Tipo de juego',
      solo: 'Solo',
      allTypes: 'Todos los tipos'
    },
    wallet: {
      title: 'Billetera',
      balance: 'Tu Saldo',
      mainBalance: 'Principal',
      bonusBalance: 'Bonificación',
      total: 'Total',
      deposit: 'Depositar',
      withdraw: 'Retirar',
      currency: 'Selección de Moneda',
      cryptocurrencies: 'Criptomonedas',
      bonusCoins: 'Monedas de Bonificación',
      bonusCoinsDescription: 'Monedas del sistema para mejorar la experiencia de juego',
      withdrawSection: 'Retirar Fondos',
      amount: 'Cantidad',
      address: 'Dirección de Billetera',
      enterAddress: 'Ingrese la dirección de billetera {currency}',
      processing: 'Procesando...',
      transactions: 'Historial de Transacciones',
      empty: 'No hay transacciones',
      depositSoon: 'La función de depósito estará disponible después de configurar la pasarela de pago',
      fillAllFields: 'Por favor complete todos los campos',
      withdrawSoon: 'La función de retiro estará disponible después de configurar la pasarela de pago',
      withdrawError: 'Error de retiro'
    },
    profile: {
      title: 'Perfil',
      stats: 'Estadísticas',
      settings: 'Configuración',
      history: 'Historial de Juegos',
      soundEffects: 'Efectos de Sonido',
      soundEffectsDesc: 'Activar sonidos del juego',
      notifications: 'Notificaciones del Bot',
      notificationsDesc: 'Recibir notificaciones sobre ganancias',
      language: 'Idioma',
      privacy: 'Privacidad',
      wallets: 'Billeteras Conectadas',
      support: 'Soporte 24/7',
      empty: 'No hay juegos',
      appearance: 'Apariencia',
      animations: 'Animaciones',
      animationsDesc: 'Activar animaciones y transiciones',
      reducedMotion: 'Movimiento Reducido',
      reducedMotionDesc: 'Reducir animaciones para mejor rendimiento',
      fontSize: 'Tamaño de Fuente',
      fontSizeDesc: 'Ajustar tamaño de fuente',
      small: 'Pequeño',
      normal: 'Normal',
      large: 'Grande',
      compactMode: 'Modo Compacto',
      compactModeDesc: 'Reducir espaciado y tamaños de elementos',
      audioNotifications: 'Audio y Notificaciones',
      hapticFeedback: 'Retroalimentación Háptica',
      hapticFeedbackDesc: 'Vibración en interacción',
      gameSettings: 'Configuración de Juego',
      autoPlay: 'Reproducción Automática',
      autoPlayDesc: 'Continuar jugando automáticamente',
      showBalance: 'Mostrar Saldo',
      showBalanceDesc: 'Mostrar saldo en panel superior',
      privacyTitle: 'Configuración de Privacidad',
      showBalancePrivacy: 'Mostrar Saldo',
      showBalancePrivacyDesc: 'Permitir que otros vean tu saldo',
      showStatsPrivacy: 'Mostrar Estadísticas',
      showStatsPrivacyDesc: 'Permitir que otros vean tus estadísticas',
      allowReferrals: 'Permitir Referidos',
      allowReferralsDesc: 'Permitir que otros te inviten mediante enlaces de referido',
      dataSharing: 'Compartir Datos',
      dataSharingDesc: 'Permitir el intercambio de datos anónimos para mejorar el servicio'
    },
    referral: {
      title: 'Programa de Referidos',
      subtitle: '¡Gana junto con tus amigos!',
      friends: 'Amigos',
      earnings: 'Tus Ganancias',
      percent: '% de apuestas',
      link: 'Tu Enlace de Referido',
      copy: 'Copiar',
      copied: 'Copiado',
      invite: 'Invitar Amigos',
      howItWorks: '¿Cómo funciona?'
    }
  }
};

/** Мови, для яких є club_notice_tittle_*.png + підтримка UI */
export const UI_SUPPORTED_LANGUAGE_CODES = [
  'en',
  'uk',
  'ru',
  'es',
  'hi',
  'it',
  'jp',
  'kr',
  'pt',
  'sc',
  'th',
  'tr',
  'vi',
];

const UI_LANG_ALIASES = {
  zh: 'sc',
  cn: 'sc',
  de: 'en',
  ja: 'jp',
  ko: 'kr',
};

/** Китайська в асетах як sc (спрощена) */
translations.sc = translations.zh;

/** Повні копії англійської для мов без окремого файлу перекладів */
(function cloneEnIntoSupported() {
  const payload = JSON.stringify(translations.en);
  for (const code of ['hi', 'it', 'jp', 'kr', 'pt', 'th', 'tr', 'vi']) {
    translations[code] = JSON.parse(payload);
  }
})();

function normalizeLanguageCode(code) {
  if (!code) return 'en';
  const c = String(code).toLowerCase().split('-')[0];
  const mapped = UI_LANG_ALIASES[c] || c;
  if (translations[mapped]) return mapped;
  if (UI_SUPPORTED_LANGUAGE_CODES.includes(mapped)) return mapped;
  return 'en';
}

// Get language from localStorage or default to English
export function getLanguage() {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('language') || 'en';
    return normalizeLanguageCode(raw);
  }
  return 'en';
}

// Set language
export function setLanguage(lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', normalizeLanguageCode(lang));
  }
}

// Get translation
export function t(key, params = null, lang = null) {
  // Handle old signature: t(key, lang) - if second param is a string and not an object, treat it as lang
  if (params && typeof params === 'string' && !lang) {
    lang = params;
    params = null;
  }
  
  const currentLang = lang || getLanguage();
  const keys = key.split('.');
  const fallbackChain = [currentLang, 'en', 'ru', 'es'];
  let result = null;
  for (const L of fallbackChain) {
    const bundle = translations[L];
    if (!bundle) continue;
    let v = bundle;
    for (const k of keys) {
      v = v?.[k];
    }
    if (typeof v === 'string') {
      result = v;
      break;
    }
  }
  result = result || key;
  
  // Replace parameters if provided
  if (params && typeof params === 'object' && typeof result === 'string') {
    Object.keys(params).forEach(param => {
      result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });
  }
  
  return result;
}

// Мови інтерфейсу (узгоджено з club_notice_tittle_*)
export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' },
  { code: 'kr', name: '한국어', flag: '🇰🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'sc', name: '中文', flag: '🇨🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export default { t, getLanguage, setLanguage, languages };
