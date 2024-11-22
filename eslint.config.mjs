import pluginJs from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Base configuration for JavaScript and JSX files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2021, // Enables modern JavaScript syntax
      sourceType: "module", // Allows the use of ES modules
      globals: globals.browser, // Adds browser globals like `window`, `document`, etc.
    },
    rules: {
      // Additional recommended JavaScript rules
      "no-unused-vars": "warn",
      "no-console": "warn",
      eqeqeq: "error",
      curly: "error",
    },
  },
  // Add recommended JavaScript rules from the `@eslint/js` plugin
  pluginJs.configs.recommended,

  // Add recommended React rules
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed if you're using Next.js or React 17+
      "react/prop-types": "off", // Disable if you are not using PropTypes
      "react/jsx-uses-react": "off", // React 17+ JSX runtime
    },
  },

  // Add Prettier integration (optional but recommended for consistent formatting)
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      "prettier/prettier": "error", // Show Prettier issues as ESLint errors
    },
  },
];
