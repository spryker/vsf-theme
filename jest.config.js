module.exports = {
  testMatch: ["**/*.spec.(js|ts)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
    "^.+\\.(css|less|scss)$": "<rootDir>/config/jest/cssStub.js"
  },
  setupFiles: ["<rootDir>/config/jest/setupTestEnvironment.ts"],
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
    "^.*\\.vue$": "vue-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@storefront-ui|@vue-storefront|@spryker-vsf)"
  ],
  collectCoverageFrom: [
    "<rootDir>/composables/**/*.ts",
    "<rootDir>/components/**/*.vue",
    "<rootDir>/pages/**/*.vue"
  ],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.spec.json"
    }
  }
};
