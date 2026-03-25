/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  clearMocks: true,
  testMatch: ['**/?(*.)+(spec|test).ts'],
  transformIgnorePatterns: ['node_modules/(?!(@tecsafe)/)']
}
