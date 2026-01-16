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
      liveWins: 'LIVE'
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
      allTypes: 'Усі типи'
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
      bonusBalance: 'Бонусний баланс',
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
      showBalanceDesc: 'Відображати баланс у верхній панелі'
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
      bonusBalance: 'Бонусный баланс',
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
      liveWins: 'LIVE'
    },
    games: {
      title: 'Games Library',
      all: 'All',
      slots: 'Slots',
      table: 'Table',
      quick: 'Quick',
      favorites: 'Favorites',
      play: 'Play',
      empty: 'No games in this category'
    },
    wallet: {
      title: 'Wallet',
      balance: 'Your Balance',
      bonusBalance: 'Bonus Balance',
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
      showBalanceDesc: 'Display balance in top panel'
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
      bonusBalance: '奖金余额',
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
      bonusBalance: 'Bonusguthaben',
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
      bonusBalance: 'Saldo de Bonificación',
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
      showBalanceDesc: 'Mostrar saldo en panel superior'
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

// Get language from localStorage or default to English
export function getLanguage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
}

// Set language
export function setLanguage(lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
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
  let value = translations[currentLang];
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) {
      // Fallback to English
      value = translations.en;
      for (const k2 of keys) {
        value = value?.[k2];
      }
      if (!value) {
        // Final fallback to Ukrainian if English also fails
        value = translations.uk;
        for (const k3 of keys) {
          value = value?.[k3];
        }
      }
      break;
    }
  }
  
  let result = value || key;
  
  // Replace parameters if provided
  if (params && typeof params === 'object' && typeof result === 'string') {
    Object.keys(params).forEach(param => {
      result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });
  }
  
  return result;
}

// Language options
export const languages = [
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

export default { t, getLanguage, setLanguage, languages };
