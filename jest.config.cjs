module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['reflect-metadata'],
    testMatch: [
    //  '**/test/**/*.test.ts',
      '**/test/Unit Test/controller/**/*.spec.ts',
      '**/test/Unit Test/service/**/*.spec.ts',
      '**/test/Unit Test/repository/**/*.spec.ts',
      '**/test/Unit Test/util/**/*.spec.ts',
      '**/test/Unit Test/middleware/**/*.spec.ts'
    ],
    collectCoverageFrom: [
      'src/controller/**/*.ts',
      'src/service/**/*.ts',
      'src/repository/**/*.ts',
      'src/util/**/*.ts',
      'src/middleware/**/*.ts',
    ]
  };