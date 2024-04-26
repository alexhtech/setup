export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /**
   * Implement the DateTime<Utc> scalar
   *
   * The input/output is a string in RFC3339 format.
   */
  DateTime: { input: string; output: string };
  /**
   * ISO 8601 calendar date without timezone.
   * Format: %Y-%m-%d
   *
   * # Examples
   *
   * * `1994-11-13`
   * * `2000-02-24`
   */
  NaiveDate: { input: string; output: string };
};

export type PerformanceType = {
  __typename?: 'PerformanceType';
  date: Scalars['NaiveDate']['output'];
  value: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get a SIP by name */
  getSip: SipType;
  /** Get all SIPs */
  getSips: Array<SipType>;
};

export type QueryGetSipArgs = {
  name: Scalars['String']['input'];
};

export type SipType = {
  __typename?: 'SipType';
  apr: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  performance: Array<PerformanceType>;
};
