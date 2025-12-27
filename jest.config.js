/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^~/(.*)$": "<rootDir>/src/$1",
    },
    coveragePathIgnorePatterns: [
        "<rootDir>/src/migrations",
        "<rootDir>/src/entities",
    ],
    setupFiles: ["<rootDir>/tests/setup.ts"],
};
