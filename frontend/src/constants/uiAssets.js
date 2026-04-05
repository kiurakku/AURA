/** PNG з `public/materials/assets` */
const BASE = '/materials/assets';
/** Банери промо / ігор: `public/materials/banners` */
const BANNERS = '/materials/banners';
/** Ранги 1–10: `public/materials/ranks` */
const RANKS = '/materials/ranks';
/** Іконки інтерфейсу: `public/materials/icons` (частина файлів лише тут, не в assets) */
const ICONS = '/materials/icons';
/** Іконки валют / бонус-монет: `public/materials/coins` */
const COINS = '/materials/coins';

export function uiAsset(filename) {
  return `${BASE}/${encodeURIComponent(filename)}`;
}

export function iconMaterial(filename) {
  return `${ICONS}/${encodeURIComponent(filename)}`;
}

export function coinMaterial(filename) {
  return `${COINS}/${encodeURIComponent(filename)}`;
}

export function bannerMaterial(filename) {
  return `${BANNERS}/${encodeURIComponent(filename)}`;
}

/**
 * Ореол аватара за прогресом:
 * 0 маска, 1–2 маски/рамка, 3 → avatar_2-1.png, 4 → avatar_2.png
 */
export function avatarHaloByProgress(totalWagered) {
  const w = Number(totalWagered) || 0;
  if (w >= 25000) return uiAsset('avatar_2.png');
  if (w >= 5000) return uiAsset('avatar_2-1.png');
  if (w >= 500) return uiAsset('icon_bg.png');
  if (w >= 100) return uiAsset('mask_bigchip.png');
  return uiAsset('mask_chip.png');
}

export function avatarHaloTier(totalWagered) {
  const w = Number(totalWagered) || 0;
  if (w >= 25000) return 4;
  if (w >= 5000) return 3;
  if (w >= 500) return 2;
  if (w >= 100) return 1;
  return 0;
}

/** Зірка рангу 1–10 з /materials/ranks */
export function rankStarAsset(level) {
  const n = Math.min(10, Math.max(1, Math.floor(Number(level) || 1)));
  return `${RANKS}/star${n}.png`;
}

/** Рівень рангу 1–10 від суми ставок (для UI, якщо немає rank_id з API) */
export function rankLevelFromWagered(totalWagered) {
  const w = Number(totalWagered) || 0;
  const thresholds = [0, 200, 800, 2500, 8000, 20000, 50000, 120000, 300000, 750000];
  let level = 1;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (w >= thresholds[i]) {
      level = i + 1;
      break;
    }
  }
  return Math.min(10, Math.max(1, level));
}

/** Заголовок «нотісів» за мовою (файли club_notice_tittle_*.png) */
export function clubNoticeTitleAsset(langCode) {
  const raw = String(langCode || 'en')
    .toLowerCase()
    .split('-')[0];
  const alias = { zh: 'sc', cn: 'sc', uk: 'en', de: 'en', ja: 'jp', ko: 'kr' };
  const code = alias[raw] || raw;
  const valid = new Set(['en', 'es', 'hi', 'it', 'jp', 'kr', 'pt', 'ru', 'sc', 'th', 'tr', 'vi']);
  const suffix = valid.has(code) ? code : 'en';
  return uiAsset(`club_notice_tittle_${suffix}.png`);
}

/** Іконка гри в списку (без емодзі) */
const GAME_LIST_ICON = {
  crash: 'fire.png',
  dice: 'icon_number.png',
  mines: 'Bomb.png',
  plinko: 'bind_star.png',
  slots1: 'daily_reward_ppcoins.png',
  slots2: 'blurchip.png',
  blackjack: 'poker_a.png',
  roulette: 'chip_s.png',
  poker: 'poker_k.png',
  online: 'mtt_logo.png',
  battle: 'icon_champion.png',
  'cyber-crash': 'mtt_logo.png',
  'frost-dice': 'icon_number.png',
  'neon-roulette': 'mtt_logo.png',
  tournament: 'mtt_logo.png',
  slots: 'pic_chips.png',
};

export function gameListIcon(gameId) {
  const id = String(gameId || '')
    .toLowerCase()
    .replace(/\s+/g, '');
  if (!id) return uiAsset('table_icon.png');
  const file = GAME_LIST_ICON[id];
  if (file) return uiAsset(file);
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  const pool = [
    'mtt_logo.png',
    'table_icon.png',
    'icon_colorgame.png',
    'union_head.png',
    'chip_s.png',
  ];
  return uiAsset(pool[Math.abs(h) % pool.length]);
}

/**
 * Тема екрану гри після лобі: фон, верхня смуга, чіпи по боках, рамка, стіл.
 * Crash → bg_rg + chip_l/r; Dice → bg_crg; Mines → bg_mtt + bgchip_l/r.
 */
export const GAME_LOBBY_THEME = {
  crash: {
    bodyBg: uiAsset('bg_rg.png'),
    topBar: uiAsset('bg_rg_top.png'),
    chipL: uiAsset('chip_l.png'),
    chipR: uiAsset('chip_r.png'),
    frame: uiAsset('frame_bg.png'),
    table: uiAsset('list_table_flash.png'),
  },
  dice: {
    bodyBg: uiAsset('bg_crg.png'),
    topBar: uiAsset('bg_crg_top.png'),
    chipL: uiAsset('chip_l.png'),
    chipR: uiAsset('chip_r.png'),
    frame: uiAsset('frame_bg.png'),
    table: uiAsset('list_table_colorgame.png'),
  },
  mines: {
    bodyBg: uiAsset('bg_mtt.png'),
    topBar: uiAsset('bg_mtt_top.png'),
    chipL: uiAsset('bgchip_l.png'),
    chipR: uiAsset('bgchip_r.png'),
    frame: uiAsset('frame_bg.png'),
    table: uiAsset('list_table_seka.png'),
  },
};

export function gameLobbyTheme(gameKey) {
  const k = String(gameKey || 'crash').toLowerCase();
  return GAME_LOBBY_THEME[k] || GAME_LOBBY_THEME.crash;
}

/**
 * Текстура рядка списку гравців за «вагою» (ставки / виграші — з API).
 * VIP → list_table_vip, далі mtt / flash / кнопка списку.
 */
export function playerListRowTexture(metric) {
  const w = Number(metric) || 0;
  if (w >= 200000) return { tier: 'vip', bg: uiAsset('list_table_vip.png') };
  if (w >= 80000) return { tier: 'elite', bg: uiAsset('list_table_mtt_tag_nlh.png') };
  if (w >= 25000) return { tier: 'gold', bg: uiAsset('list_table_mtt.png') };
  if (w >= 8000) return { tier: 'plus', bg: uiAsset('ppst_table_bg.png') };
  if (w >= 1500) return { tier: 'standard', bg: uiAsset('list_table_flash.png') };
  return { tier: 'base', bg: uiAsset('list_button_nor.png') };
}

/** Іконка вкладки категорій ігор */
export function categoryTabIcon(categoryId) {
  const map = {
    all: 'mtt_logo.png',
    slots: 'pic_chips.png',
    table: 'poker_q.png',
    quick: 'fire.png',
    favorites: 'bind_star-1.png',
  };
  return uiAsset(map[categoryId] || 'table_icon.png');
}

/** Фон картки гри */
const GAME_CARD_MAP = {
  crash: 'list_table_flash.png',
  dice: 'list_table_colorgame.png',
  mines: 'list_table_seka.png',
  online: 'list_table_mtt.png',
  battle: 'list_table_vip.png',
  'cyber-crash': 'list_table_spinup.png',
  'frost-dice': 'list_table_teen_patti.png',
  'neon-roulette': 'list_table_ofc.png',
  tournament: 'list_table_mtt_tag_nlh.png',
  slots: 'list_table_nlh.png',
  slots2: 'list_table_plo5.png',
  blackjack: 'list_table_nlh3_1.png',
  roulette: 'list_table_plo.png',
  poker: 'list_table_nlhplo.png',
};

const GAME_CARD_POOL = [
  'list_table_nlh.png',
  'list_table_plo.png',
  'list_table_plo5.png',
  'list_table_ofc.png',
  'list_table_tongits.png',
  'list_table_pusoy.png',
  'list_table_ppst_nlh.png',
  'list_table_flash.png',
  'list_table_mtt.png',
  'list_table_colorgame.png',
  'single_room_list_bg.png',
  'ppsr_table_bg_normal.png',
  'ppst_table_bg.png',
];

export function gameCardBackground(gameId) {
  if (!gameId) return uiAsset('list_table_nlh.png');
  const file = GAME_CARD_MAP[gameId];
  if (file) return uiAsset(file);
  let h = 0;
  const s = String(gameId);
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return uiAsset(GAME_CARD_POOL[Math.abs(h) % GAME_CARD_POOL.length]);
}

/** Вузький банер для картки гри / швидких ігор */
const GAME_BANNER_THUMB = {
  crash: 'banner_rg.png',
  dice: 'banner_st.png',
  mines: 'banner_handmission.png',
  online: 'banner_mtt.png',
  battle: 'banner_sprg.png',
  'cyber-crash': 'banner_rg.png',
  'frost-dice': 'banner_st.png',
  'neon-roulette': 'banner_mtt.png',
  tournament: 'banner_mtt.png',
  slots: 'banner_sprg.png',
  slots2: 'banner_crg_en.png',
  blackjack: 'banner_crg_en.png',
  roulette: 'banner_crg_en.png',
  poker: 'banner_crg_en.png',
};

export function gameBannerThumb(gameId) {
  const f = GAME_BANNER_THUMB[gameId] || 'banner_crg_en.png';
  return bannerMaterial(f);
}

/** Слайди головної (тільки файли; оверлей тексту без банера) — 696×198 */
export const HOME_PROMO_BANNERS = [
  { file: 'banner_crg_en.png' },
  { file: 'banner_mtt.png' },
  { file: 'banner_rg.png' },
  { file: 'banner_handmission.png' },
  { file: 'banner_sprg.png' },
  { file: 'banner_st.png' },
];

/** Нижня навігація */
export const NAV = {
  home: uiAsset('icon_data_blinds.png'),
  games: uiAsset('table_icon.png'),
  wallet: iconMaterial('pp_chips.png'),
  referral: uiAsset('icon_people.png'),
  profile: uiAsset('iocn_member.png'),
};

export const UI = {
  back: iconMaterial('back_btn.png'),
  /** Логотип бренду в хедері */
  brandLogo: uiAsset('logo.png'),
  lobby: uiAsset('ppst_mainpage_tag.png'),
  profilePageMenu: uiAsset('list_btn_menu.png'),
  categorySectionIcon: uiAsset('table_icon_jp.png'),
  table_icon: uiAsset('table_icon.png'),
  walletPageHeading: iconMaterial('rakeFlag.png'),
  logo: uiAsset('logo.png'),
  bannerBg: uiAsset('banner_bg.png'),
  bannerBgAlt: uiAsset('banner_bg-1.png'),
  bannerDotN: iconMaterial('banner_dot_n.png'),
  bannerDotS: iconMaterial('banner_dot_s.png'),
  addBtn: iconMaterial('add_btn.png'),
  frameBg: uiAsset('frame_bg.png'),
  frameHighlight: uiAsset('frame_normal_highlight.png'),
  tableBg: uiAsset('table_bg.png'),
  bgPanel: uiAsset('bg_crg.png'),
  bgBody: uiAsset('bg_2.png'),
  bgBodyAlt: uiAsset('bg_1.png'),
  bgDeep: uiAsset('bg_3.png'),
  bgAccent: uiAsset('bg_4.png'),
  bgCorner: uiAsset('bg_corner.png'),
  bgDotLight: uiAsset('bg_dot_light.png'),
  bgFx: uiAsset('bg_fx.png'),
  bgPlayer: uiAsset('bg_player.png'),
  gameTitle: uiAsset('game_title.png'),
  gameTitleAlt: uiAsset('game_title-1.png'),
  chipIcon: uiAsset('pic_chips.png'),
  /** Іконка біля «Швидка гра» на головній (`materials/icons`) */
  quickPlayTitleIcon: iconMaterial('detailed_info_mtt.png'),
  bigChipRing: uiAsset('bigchip_ring.png'),
  bigChipBg: uiAsset('bigchip_bg.png'),
  maskChip: uiAsset('mask_chip.png'),
  maskBigchip: uiAsset('mask_bigchip.png'),
  chipL: uiAsset('chip_l.png'),
  chipR: uiAsset('chip_r.png'),
  chipS: uiAsset('chip_s.png'),
  btnGreen: uiAsset('green_btn1_nor.png'),
  btnGreenActive: uiAsset('green_btn1_sel.png'),
  btnGreen2: uiAsset('green_btn2_nor.png'),
  btnBlue: uiAsset('btn_btn_com_flat_b.png'),
  btnYellow: uiAsset('btn_btn_com_flat_y.png'),
  btnGray: uiAsset('btn_btn_com_flat_g.png'),
  btnGo: uiAsset('btn_go.png'),
  btnHelp: uiAsset('btn_help.png'),
  btnClose: iconMaterial('btn_close.png'),
  btnShare: iconMaterial('btn_main_share_s.png'),
  btnQr: iconMaterial('btn_main_qrcode.png'),
  confirmBtn: uiAsset('confirm_btn_new.png'),
  inputBtn: uiAsset('input_btn.png'),
  picBtnBg1: uiAsset('pic_btnbg_1.png'),
  picBtnBg2: uiAsset('pic_btnbg_2.png'),
  picBtnBg3: uiAsset('pic_btnbg_3.png'),
  picBigChip: uiAsset('pic_bigchip.png'),
  picListBg: uiAsset('pic_listbg.png'),
  picArrow: uiAsset('pic_arrow.png'),
  titleTx: iconMaterial('btn_title_transaction_records.png'),
  cellHidden: uiAsset('list_button_nor.png'),
  cellOn: uiAsset('list_button_on.png'),
  listLine: uiAsset('list_item_line.png'),
  listCheck: uiAsset('list_check.png'),
  listCheckOn: uiAsset('list_check_on.png'),
  filterNor: uiAsset('list_icon_filter_nor.png'),
  filterOn: uiAsset('list_icon_filter_on.png'),
  searchDel: iconMaterial('search_del_btn.png'),
  bomb: uiAsset('Bomb.png'),
  bombRed: uiAsset('Bomb_red.png'),
  safeGem: uiAsset('bind_star.png'),
  fxGlow: uiAsset('fx_glow.png'),
  fxSpotlight: uiAsset('fx_spotlight.png'),
  diceFace: uiAsset('icon_number.png'),
  starOn: uiAsset('star5.png'),
  starOff: uiAsset('star1.png'),
  medal1: uiAsset('icon_medol_1.png'),
  medal2: uiAsset('icon_medol_2.png'),
  medal3: uiAsset('icon_medol_3.png'),
  rankPng1: uiAsset('rank_1.png'),
  rankPng2: uiAsset('rank_2.png'),
  rankPng3: uiAsset('rank_3.png'),
  trophy: uiAsset('pic_trophy.png'),
  titleLeaderboard: uiAsset('title_leaderboard.png'),
  leaderboardDeco: uiAsset('pic_leaderboard.png'),
  mttBanner: uiAsset('banner_mtt.png'),
  mttLogo: uiAsset('mtt_logo.png'),
  missionTitle: uiAsset('mission_title.png'),
  timeBg: uiAsset('pic_time_bg.png'),
  iconDataTime: uiAsset('icon_data_time.png'),
  noticeGift: iconMaterial('notice_gift.png'),
  /** Бонусні монети / подарунок (якщо notice_gift відсутній) */
  bonusGiftIcon: uiAsset('mission_rewardicon.png'),
  referralRibbon: uiAsset('banner_bg-1.png'),
  giftIcon: uiAsset('mission_rewardicon.png'),
  dailySparkle: uiAsset('dailyreward_sparkle.png'),
  missionEmpty: uiAsset('mission_empty.png'),
  missionFx: uiAsset('mission_fx1.png'),
  expIcon: uiAsset('exp.png'),
  service: uiAsset('service_new.png'),
  setList: uiAsset('set_list.png'),
  iconDataPlays: uiAsset('icon_data_plays.png'),
  iconLock: uiAsset('icon_lock.png'),
  iconColorgame: uiAsset('icon_colorgame.png'),
  iconChampion: uiAsset('icon_champion.png'),
  avatarFrame: uiAsset('avatar_2.png'),
  selectRing: uiAsset('pic_select_ring.png'),
  unionHead: uiAsset('union_head.png'),
  waitlistBg: uiAsset('waitlist_bg.png'),
  pokerA: uiAsset('poker_a.png'),
  pokerK: uiAsset('poker_k.png'),
  pokerQ: uiAsset('poker_q.png'),
  colorgameNor: uiAsset('table_colorgame_normal.png'),
  colorgameSel: uiAsset('table_colorgame_clicked.png'),
  creatorTag: uiAsset('creator_tag.png'),
  pinOff: uiAsset('list_check.png'),
  pinOn: uiAsset('list_check_on.png'),
  /** Обрана гра в списку ігор */
  favoriteStarOn: iconMaterial('start_light.png'),
  favoriteStarOff: iconMaterial('start_gray.png'),
  /** Базова текстура картки гри на всю площу (`card_type.png` у репо немає) */
  gameCardType: uiAsset('card_type_bg.png'),
  categorySlots: uiAsset('pic_chips.png'),
  categoryTable: uiAsset('poker_q.png'),
  categoryLive: uiAsset('table_icon.png'),
  liveFire: uiAsset('fire.png'),
  clubUserInterface: uiAsset('club_user_interface.png'),
};

export const TX_ICON = {
  in: uiAsset('pic_arrow.png'),
  out: uiAsset('icon_top.png'),
  gift: iconMaterial('notice_gift.png'),
  game: uiAsset('icon_colorgame.png'),
  default: uiAsset('chip_s.png'),
};

export const DECOR_TEXTURES = [
  'bg_dot_light.png',
  'fx_dotlight.png',
  'particle_13.png',
  'dust.png',
  'leaf_a1.png',
  'glow.png',
].map((f) => uiAsset(f));

export function decorTexture(index) {
  return DECOR_TEXTURES[Math.abs(index) % DECOR_TEXTURES.length];
}
