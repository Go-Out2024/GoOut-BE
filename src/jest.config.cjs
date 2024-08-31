module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
    //  '**/test/**/*.test.ts',
      '**/test/controller/**/*.test.ts',
      '**/test/service/**/*.test.ts',
      '**/test/repository/**/*.test.ts',
      '**/test/util/**/*.test.ts',
      '**/test/middleware/**/*.test.ts'
    ],
    collectCoverageFrom: [
      'src/controller/**/*.ts',
      'src/service/**/*.ts',
      'src/repository/**/*.ts',
      'src/util/**/*.ts',
      'src/middleware/**/*.ts',
    ]
  };