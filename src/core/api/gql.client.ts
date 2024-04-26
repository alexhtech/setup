import { injectable } from 'inversify';

import { BaseGQLClientService } from './base-gql.client';

@injectable()
export class GraphQLClientService extends BaseGQLClientService {
  constructor() {
    super({
      url: 'https://api.nav.finance',
    });
  }
}
