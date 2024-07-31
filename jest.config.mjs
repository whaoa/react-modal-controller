/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+.tsx?$': ['ts-jest', { useESM: true }],
  },
  roots: [
    '<rootDir>/test',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/test/jest.setup.ts',
  ],
  testMatch: [
    '<rootDir>/test/**/*.(test|spec).(ts|tsx)',
  ],
};

export default config;
