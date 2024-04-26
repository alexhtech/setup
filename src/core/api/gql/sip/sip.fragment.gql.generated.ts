/* eslint-disable */
// @ts-ignore
import { GetSubscription, Request } from '@core/api/query-types';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

import * as Types from '../../schema';

export type SipFragment = { __typename?: 'SipType'; apr: number; createdAt: string; name: string };

export const SipFragmentDoc = gql`
  fragment Sip on SipType {
    apr
    createdAt
    name
  }
`;
