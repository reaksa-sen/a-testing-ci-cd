module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/__test__/*.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/__test__/*.ts?(x)',
    '!**/node_modules/**',
  ],
  // clearMock: true
  coverageThreshold: {
    global: {
      branches: 0, // conditional
      functions: 0, // how many defined functions are called during test
      lines: 0, // lines of code execute in the test
      statements: 0,
    },
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
