module.exports = {
  roots: ["<rootDir>/functions"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: ["functions/**/*.{ts,tsx}", "!src/app.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ["json", "lcov", "text", "clover"],
}
