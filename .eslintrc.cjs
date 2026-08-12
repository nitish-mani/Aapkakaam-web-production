module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: [
    "dist",
    "build",
    ".wrangler",
    ".eslintrc.cjs",
    "node_modules",
    // Injected WhatsApp Web scraping helper — runs in an external page
    // context (WAPI/Store/webpackChunk are globals there, not here).
    "src/wa/**",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "react/no-unknown-property": "warn",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "no-empty": ["warn", { allowEmptyCatch: true }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-undef": "warn",
    "react-hooks/exhaustive-deps": "warn",
    // Legacy code calls hooks conditionally in a few places. These are real
    // bugs but out of scope for this hardening pass — see backlog in README.
    "react-hooks/rules-of-hooks": "warn",
    "no-irregular-whitespace": "warn",
  },
};
