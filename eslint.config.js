// @ts-check
import parser from "@typescript-eslint/parser";
import plugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: globals.node
    },
    plugins: {
      "@typescript-eslint": plugin,
      prettier,
      import: importPlugin
    },
    rules: {
      // TS rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // Import hygiene
      "import/first": "error",
      "import/no-duplicates": "error",

      // Prettier integration
      "prettier/prettier": "warn"
    }
  },
  {
    ignores: ["dist", "node_modules"]
  }
];
