import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Экспериментальные правила react-hooks v7 ругаются на массу рабочего кода.
      // Отключаем, чтобы CI не падал на легитимных setState внутри useEffect и
      // обновлении ref в рендере (контролируемые паттерны).
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      // Часть модалок экспортирует мелкие константы рядом с компонентом — допускаем.
      'react-refresh/only-export-components': 'off',
    },
  },
])
