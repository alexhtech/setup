/* eslint-disable */
// @ts-ignore
import { GetSubscription, Request } from '@core/api/query-types';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

import * as Types from '../../schema';
import { SipFragmentDoc } from './sip.fragment.gql.generated';

export type GetSipsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetSipsQuery = {
  __typename?: 'Query';
  getSips: Array<{ __typename?: 'SipType'; apr: number; createdAt: string; name: string }>;
};

export const GetSipsDocument = gql`
  query GetSips {
    getSips {
      ...Sip
    }
  }
  ${SipFragmentDoc}
`;

export function GetSips<R extends GetSipsQuery, V extends GetSipsQueryVariables>(
  request: Request<R, V>,
  variables?: V,
  headers?: HeadersInit,
): Promise<R> {
  return request(GetSipsDocument, variables, headers);
}
