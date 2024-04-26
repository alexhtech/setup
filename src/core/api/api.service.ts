import { IntrospectionQuery } from "graphql";
import { injectable } from "inversify";

import schema from "../../../schema.json";

import { QueryLoader } from "../query/query.loader";
import { BaseApiService } from "./base-api.service";
import { createScalarExchange } from "./custom-scalar.exchange";
import { GraphQLClientService } from "./gql.client";

// import { scalars } from './scalars';

@injectable()
export class ApiService extends BaseApiService {
  constructor(
    graphQLClientService: GraphQLClientService,
    queryLoader: QueryLoader
  ) {
    super(
      graphQLClientService,
      {
        scalarExchange: createScalarExchange({
          scalars: {},
          schema: schema as unknown as IntrospectionQuery,
        }),
        url: "https://api.nav.finance/graphql",
        wsUrl: undefined,
      },
      queryLoader
    );
  }
}
