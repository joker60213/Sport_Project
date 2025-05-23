module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['react', '@typescript-eslint', 'import', 'jsx-a11y'],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:jsx-a11y/recommended',
      'prettier',
    ],
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {}, // чтобы работал alias @
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // не нужен импорт React в JSX
      '@typescript-eslint/no-unused-vars': ['warn'], // ворнинги не мешают
      'import/order': ['warn', { groups: [['builtin', 'external', 'internal']] }],
    },
  }
  