import gql from "graphql-tag";

export const SIP_FRAGMENT = gql`
  fragment Sip on SipType {
    apr
    createdAt
    name
  }
`;
