const baseConfig = require('./../../jest.base.config');

module.exports = {
  ...baseConfig,
  testPathIgnorePatterns: ['<rootDir>/_theme/cypress/', '<rootDir>/cypress/'],
};
