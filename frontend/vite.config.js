import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false // Вимкнути overlay для помилок decodeURI
    },
    fs: {
      strict: false, // Дозволити роботу з пробілами в шляхах
      allow: ['..'] // Дозволити доступ до батьківських директорій
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    base: '/'
  },
  // Обробка статичних файлів з пробілами та кирилицею
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif']
});
