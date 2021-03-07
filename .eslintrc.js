module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['standard-with-typescript', 'prettier',],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    "semi": "off",
    "@typescript-eslint/semi": ["error", "always"],
    "quotes": ["error", "single"],
    'space-before-function-paren': 'off',
    'no-useless-constructor': 'off',
    'max-len': ['error', { code: 120 }],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error', 
      { allowNumber: true, allowBoolean: true, allowAny: true, allowNullish: true },
    ],
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
  },
};
