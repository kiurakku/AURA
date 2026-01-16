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
      empty: 'Немає ігор у цій категорії'
    },
    // Wallet
    wallet: {
      title: 'Гаманець',
      balance: 'Ваш баланс',
      bonusBalance: 'Бонусний баланс',
      deposit: 'Поповнити',
      withdraw: 'Вивести',
      currency: 'Вибір валюти',
      transactions: 'Історія транзакцій',
      empty: 'Немає транзакцій'
    },
    // Profile
    profile: {
      title: 'Профіль',
      stats: 'Статистика',
      settings: 'Налаштування',
      history: 'Історія ігор',
      soundEffects: 'Звукові ефекти',
      notifications: 'Сповіщення в бот',
      language: 'Мова',
      privacy: 'Конфіденційність',
      wallets: 'Прив\'язані гаманці',
      support: 'Підтримка 24/7',
      empty: 'Немає ігор'
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
      empty: 'Нет игр в этой категории'
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
      empty: 'Нет транзакций'
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
      empty: 'No transactions'
    },
    profile: {
      title: 'Profile',
      stats: 'Statistics',
      settings: 'Settings',
      history: 'Game History',
      soundEffects: 'Sound Effects',
      notifications: 'Bot Notifications',
      language: 'Language',
      privacy: 'Privacy',
      wallets: 'Connected Wallets',
      support: 'Support 24/7',
      empty: 'No games'
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
      empty: '此类别中没有游戏'
    },
    wallet: {
      title: '钱包',
      balance: '您的余额',
      bonusBalance: '奖金余额',
      deposit: '充值',
      withdraw: '提现',
      currency: '货币选择',
      transactions: '交易历史',
      empty: '没有交易'
    },
    profile: {
      title: '个人资料',
      stats: '统计',
      settings: '设置',
      history: '游戏历史',
      soundEffects: '音效',
      notifications: '机器人通知',
      language: '语言',
      privacy: '隐私',
      wallets: '已连接钱包',
      support: '24/7 支持',
      empty: '没有游戏'
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
      transactions: 'Transaktionsverlauf',
      empty: 'Keine Transaktionen'
    },
    profile: {
      title: 'Profil',
      stats: 'Statistiken',
      settings: 'Einstellungen',
      history: 'Spielverlauf',
      soundEffects: 'Soundeffekte',
      notifications: 'Bot-Benachrichtigungen',
      language: 'Sprache',
      privacy: 'Datenschutz',
      wallets: 'Verbundene Geldbörsen',
      support: 'Support 24/7',
      empty: 'Keine Spiele'
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
      empty: 'No hay juegos en esta categoría'
    },
    wallet: {
      title: 'Billetera',
      balance: 'Tu Saldo',
      bonusBalance: 'Saldo de Bonificación',
      deposit: 'Depositar',
      withdraw: 'Retirar',
      currency: 'Selección de Moneda',
      transactions: 'Historial de Transacciones',
      empty: 'No hay transacciones'
    },
    profile: {
      title: 'Perfil',
      stats: 'Estadísticas',
      settings: 'Configuración',
      history: 'Historial de Juegos',
      soundEffects: 'Efectos de Sonido',
      notifications: 'Notificaciones del Bot',
      language: 'Idioma',
      privacy: 'Privacidad',
      wallets: 'Billeteras Conectadas',
      support: 'Soporte 24/7',
      empty: 'No hay juegos'
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
export function t(key, lang = null) {
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
  
  return value || key;
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
