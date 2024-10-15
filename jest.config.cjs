module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["reflect-metadata"],
  testMatch: [
    //  '**/test/**/*.test.ts',
    "**/test/Unit Test/controller/**/*.Spec.ts",
    "**/test/Unit Test/service/**/*.Spec.ts",
    "**/test/Unit Test/repository/**/*.Spec.ts",
    "**/test/Unit Test/util/**/*.Spec.ts",
    "**/test/Unit Test/middleware/**/*.Spec.ts",
    // "**/test/Integration Test/**/*.Spec.ts",
  ],
  collectCoverageFrom: [
    "src/controller/**/*.ts",
    "src/service/**/*.ts",
    "src/repository/**/*.ts",
    "src/util/**/*.ts",
    "src/middleware/**/*.ts",
  ],
};
