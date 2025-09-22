export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: [
    "./src/module/core/students/tests",
    "./src/module/core/users/tests",
    "./src/shared/auth/tests",
  ],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
