import { gql } from "graphql-tag";
import { SIP_FRAGMENT } from "./sip.fragment.gql";

export const GET_SIPS = gql`
  ${SIP_FRAGMENT}

  query GetSips {
    getSips {
      ...Sip
    }
  }
`;
