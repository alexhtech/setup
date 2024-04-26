import { ContainerModule } from "inversify";

import { createIOC } from "@/core/ioc/ioc";

import { ApiService } from "./api.service";
import { GraphQLClientService } from "./gql.client";

export const apiModule = createIOC({
  module: new ContainerModule((bind) => {
    bind(GraphQLClientService).toSelf();
    bind(ApiService).toSelf();
  }),
});
