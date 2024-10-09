module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],

  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1', // Use @src as alias to map to src folder
    '^@test/(.*)$': '<rootDir>/test/$1', // Use @src as alias to map to src folder
  },
};
