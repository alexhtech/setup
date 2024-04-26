/* eslint-disable */
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
  /** `Date` type as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: any; output: any };
};

export type Auth = {
  __typename?: 'Auth';
  token: Scalars['String']['output'];
  user: User;
};

export type ChangeUserPasswordInput = {
  newPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateCurrencyInput = {
  maxAmount: Scalars['Float']['input'];
  minAmount: Scalars['Float']['input'];
  symbol: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
  tolerancePercent?: InputMaybe<Scalars['Float']['input']>;
  username: Scalars['String']['input'];
};

export type Currency = {
  __typename?: 'Currency';
  id: Scalars['String']['output'];
  maxAmount: Scalars['Float']['output'];
  minAmount: Scalars['Float']['output'];
  symbol: Scalars['String']['output'];
};

export type EditCurrencyInput = {
  id: Scalars['String']['input'];
  maxAmount: Scalars['Float']['input'];
  minAmount: Scalars['Float']['input'];
  symbol: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeAvatar: Scalars['Boolean']['output'];
  changePassword: Scalars['Boolean']['output'];
  confirmEmail: Scalars['Boolean']['output'];
  createCurrency: Currency;
  createRole: Role;
  createUser: User;
  deleteUser: Scalars['String']['output'];
  editCurrency: Currency;
  editUser: User;
  login: Auth;
  loginWithGoogle: Auth;
  register: Auth;
  registerWithGoogle: Auth;
  requestResetPassword: Scalars['Boolean']['output'];
  resendEmail: Scalars['Boolean']['output'];
  resetPasswordWithToken: Scalars['Boolean']['output'];
  resetUserPassword: User;
  updateRole: Role;
};

export type MutationChangeAvatarArgs = {
  avatarId: Scalars['String']['input'];
};

export type MutationChangePasswordArgs = {
  data: ChangeUserPasswordInput;
};

export type MutationConfirmEmailArgs = {
  token: Scalars['String']['input'];
};

export type MutationCreateCurrencyArgs = {
  data: CreateCurrencyInput;
};

export type MutationCreateRoleArgs = {
  data: RoleInput;
};

export type MutationCreateUserArgs = {
  data: CreateUserInput;
};

export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};

export type MutationEditCurrencyArgs = {
  data: EditCurrencyInput;
};

export type MutationEditUserArgs = {
  data: UserInput;
  id: Scalars['String']['input'];
};

export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MutationLoginWithGoogleArgs = {
  code: Scalars['String']['input'];
};

export type MutationRegisterArgs = {
  data: CreateUserInput;
};

export type MutationRegisterWithGoogleArgs = {
  code: Scalars['String']['input'];
};

export type MutationRequestResetPasswordArgs = {
  email: Scalars['String']['input'];
};

export type MutationResendEmailArgs = {
  id: Scalars['String']['input'];
};

export type MutationResetPasswordWithTokenArgs = {
  data: ResetPasswordWithTokenInput;
};

export type MutationResetUserPasswordArgs = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MutationUpdateRoleArgs = {
  data: RoleInput;
  id: Scalars['Float']['input'];
};

export type Permission = {
  __typename?: 'Permission';
  id: Scalars['Int']['output'];
  key: PermissionKey;
  meta?: Maybe<Scalars['String']['output']>;
};

export type PermissionInput = {
  /** Optional. If not provided the Permission will be created otherwise updated */
  id?: InputMaybe<Scalars['Int']['input']>;
  key: PermissionKey;
  meta?: InputMaybe<Scalars['String']['input']>;
};

export enum PermissionKey {
  LockToCurrency = 'LockToCurrency',
}

export type Query = {
  __typename?: 'Query';
  currencies: Array<Currency>;
  currentUser: User;
  getRole: Role;
  roles: Array<Role>;
  users: UserPaginated;
  wallets: Array<Wallet>;
};

export type QueryGetRoleArgs = {
  id: Scalars['Float']['input'];
};

export type QueryUsersArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type ResetPasswordWithTokenInput = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Permission>;
};

export type RoleInput = {
  name: Scalars['String']['input'];
  permissions?: Array<PermissionInput>;
};

export type Subscription = {
  __typename?: 'Subscription';
  userUpdated: User;
  walletUpdated: Wallet;
};

export type User = {
  __typename?: 'User';
  avatarId: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  email: Scalars['String']['output'];
  emailConfirmed: Scalars['Boolean']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  roles: Array<Role>;
  tolerancePercent: Scalars['Float']['output'];
  username: Scalars['String']['output'];
  wallets: Array<Wallet>;
};

export type UserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  tolerancePercent?: InputMaybe<Scalars['Float']['input']>;
};

export type UserPaginated = {
  __typename?: 'UserPaginated';
  items: Array<User>;
  total: Scalars['Int']['output'];
};

export type Wallet = {
  __typename?: 'Wallet';
  balance: Scalars['Float']['output'];
  currency: Currency;
  id: Scalars['String']['output'];
  user: User;
};
