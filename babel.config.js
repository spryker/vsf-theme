const { resolve } = require("path");
const { readFileSync } = require("fs");

const babelConfigPath = resolve(__dirname, ".babelrc");

const babelConfig = JSON.parse(readFileSync(babelConfigPath, "utf-8"));

module.exports = babelConfig;
