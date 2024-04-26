import type { CodegenConfig } from "@graphql-codegen/cli";

const scalars = {
  JSON: "string",
  Timestamp: "number",
  DateTime: "string",
  NaiveDate: "string",
};

const config: CodegenConfig = {
  overwrite: true,
  schema: "schema.graphql",
  documents: ["src/core/api/gql/**/*.ts", "!**/*.generated.ts"],
  generates: {
    "src/core/api/schema.ts": {
      plugins: ["typescript"],
      config: {
        scalars,
      },
    },
    "src/core/api": {
      config: {
        strictScalars: true,
        scalars,
        importQueryTypesFrom: "@core/api/query-types",
      },
      preset: "near-operation-file",
      presetConfig: {
        extension: ".generated.ts",
        baseTypesPath: "schema.ts",
      },
      plugins: [
        "typescript-operations",
        "graphql-request-functions",
        {
          add: {
            content: `/* eslint-disable */
        // @ts-ignore`,
          },
        },
      ],
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
