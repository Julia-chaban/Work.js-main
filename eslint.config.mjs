import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import config from 'eslint-config-prettier'
import plugin from 'eslint-plugin-prettier/recommended'

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        plugins: { js },
        extends: ['js/recommended'],
    },
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        languageOptions: { globals: globals.browser },
    },
    pluginReact.configs.flat.recommended,
    config,
    plugin,
])
