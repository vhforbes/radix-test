module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],

  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/$1', // Use @src as alias to map to src folder
  },
};
