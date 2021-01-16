module.exports = {
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ["/node_modules/**", ".next/**"],
  rules: {
    "no-unused-vars": ["error" /*, { args: "none", argsIgnorePattern: "req|res|next|val" }*/],
    "prettier/prettier": ["error"],
    "react/prop-types": ["off"],
    "react/react-in-jsx-scope": ["off"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
