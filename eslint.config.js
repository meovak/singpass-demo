const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
module.exports = [
  {
    ignores: ["**/*.ts"],
  },
  eslintPluginPrettierRecommended,
];
