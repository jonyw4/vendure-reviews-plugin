module.exports = {
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: [
    '**/src/**',
    '!**/node_modules/**',
    '!src/types/generated-admin-schema.ts',
    '!src/types/generated-shop-schema.ts'
  ]
};
