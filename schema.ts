import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://api.nav.finance",
  generates: {
    "schema.graphql": {
      plugins: ["schema-ast"],
    },
    "schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
