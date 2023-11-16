module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'plugin:react/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  plugins: ['check-file', 'react'],
  rules: {
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'react/react-in-jsx-scope': 'off',
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{js,ts}': 'KEBAB_CASE',
        '**/*.{tsx}': 'PASCAL_CASE',
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        '**/*': 'NEXT_JS_APP_ROUTER_CASE',
      },
    ],
    'react/react-in-jsx-scope': 'off',
  },
}
