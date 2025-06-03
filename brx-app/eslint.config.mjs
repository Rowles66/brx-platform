// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...storybook.configs["flat/recommended"],
  {
    ignores: [
      // Storybook files
      "**/*.stories.tsx",
      "**/*.stories.ts",
      "**/stories/",
      // Build outputs
      ".next/",
      "out/",
      // Dependencies
      "node_modules/",
      // Generated files
      ".env.local",
      ".env.production"
    ]
  }
];

export default eslintConfig;
