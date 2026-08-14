export default {
  testEnvironment: "node",

  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
          },
          target: "es2022",
        },
        module: {
          type: "es6",
          strictMode: true,
          noInterop: false,
        },
      },
    ],
  },

  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: {
    "^(\\.\\.?/)(src|config|services|sockets|controllers|routes|middleware|utils|validators|jobs)/(.*)\\.js$":
      "$1$2/$3.ts",
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};