export default {
  transform: {
    "^.+\\.svelte$": "svelte-jester",
    "^.+\\.js$": "babel-jest",
    "^.+\\.ts$": "ts-jest"
  },
  moduleFileExtensions: ["js", "ts", "svelte"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "^\\$lib(.*)$": "<rootDir>/src/lib$1"
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true,
    }
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@testing-library)/)"
  ],
  extensionsToTreatAsEsm: ['.ts', '.svelte']
}; 