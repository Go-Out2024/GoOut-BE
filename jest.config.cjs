module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['reflect-metadata'],
    testMatch: [
    //  '**/test/**/*.test.ts',
      '**/test/controller/**/*.spec.ts',
      '**/test/service/**/*.spec.ts',
      '**/test/repository/**/*.spec.ts',
      '**/test/util/**/*.spec.ts',
      '**/test/middleware/**/*.spec.ts'
    ],
    collectCoverageFrom: [
      'src/controller/**/*.ts',
      'src/service/**/*.ts',
      'src/repository/**/*.ts',
      'src/util/**/*.ts',
      'src/middleware/**/*.ts',
    ]
  };