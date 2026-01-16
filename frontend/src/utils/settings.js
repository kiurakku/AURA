// Settings management utility
const SETTINGS_KEY = 'aura_app_settings';

const defaultSettings = {
  soundEffects: true,
  notifications: true,
  animations: true,
  hapticFeedback: true,
  reducedMotion: false,
  fontSize: 'normal', // 'small', 'normal', 'large'
  language: 'en',
  autoPlay: false,
  showBalance: true,
  compactMode: false
};

export function getSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applySettings(settings);
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
}

export function updateSetting(key, value) {
  const settings = getSettings();
  settings[key] = value;
  return saveSettings(settings);
}

export function applySettings(settings = null) {
  const currentSettings = settings || getSettings();
  const root = document.documentElement;
  
  // Apply animation settings
  if (currentSettings.animations === false || currentSettings.reducedMotion === true) {
    root.classList.add('no-animations');
    root.classList.add('reduced-motion');
  } else {
    root.classList.remove('no-animations');
    root.classList.remove('reduced-motion');
  }
  
  // Apply font size
  root.setAttribute('data-font-size', currentSettings.fontSize || 'normal');
  
  // Apply compact mode
  if (currentSettings.compactMode) {
    root.classList.add('compact-mode');
  } else {
    root.classList.remove('compact-mode');
  }
  
  // Store settings in data attribute for CSS access
  root.setAttribute('data-settings', JSON.stringify({
    animations: currentSettings.animations,
    reducedMotion: currentSettings.reducedMotion,
    fontSize: currentSettings.fontSize
  }));
}

// Initialize settings on load
if (typeof window !== 'undefined') {
  applySettings();
}

export default {
  getSettings,
  saveSettings,
  updateSetting,
  applySettings
};
