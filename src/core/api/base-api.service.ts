import { DocumentNode, ExecutionResult, getOperationAST, print } from 'graphql';
import { Client, createClient } from 'graphql-ws';
import { NEVER, Observable, filter, map, retry, share } from 'rxjs';
import invariant from 'tiny-invariant';

import { Logger } from '@/core/logger';
import { Disposable } from '@/utils/disposable';
import { RetryStrategy } from '@/utils/retry-strategy';

import { AuthHeaders } from '../auth/auth-utils';
import { isServer } from '../query/is-server';
import { QueryLoader } from '../query/query.loader';
import { BaseGQLClientService } from './base-gql.client';
import { ScalarExchangeResult } from './custom-scalar.exchange';
import { ExtractResult, ExtractVariables, QueryFn, SubscriptionFn } from './query-types';

const logger = new Logger('ApiService', isServer);

type Config = {
  scalarExchange: ScalarExchangeResult;
  url: string;
  wsUrl?: string;
  wsTeardown$?: Observable<unknown>;
  getAuthHeaders?: () => Promise<AuthHeaders>;
};

export abstract class BaseApiService extends Disposable {
  private readonly clientWS?: Client;

  private activeSocket?: WebSocket;

  private timedout?: NodeJS.Timeout;

  constructor(
    private readonly gqlClientService: BaseGQLClientService,
    private readonly config: Config,
    private readonly queryLoader: QueryLoader,
  ) {
    super();

    if (config.wsUrl) {
      this.clientWS = createClient({
        url: config.wsUrl,
        keepAlive: 5000,
        connectionParams: this.config.getAuthHeaders,
        on: {
          connected: (socket) => {
            this.activeSocket = socket as WebSocket;
          },
          ping: (received) => {
            logger.debug('Ping received', received);
            if (!received)
              this.timedout = setTimeout(() => {
                if (this.activeSocket?.readyState === WebSocket.OPEN) {
                  logger.debug('Ping timeout, closing connection');
                  this.activeSocket.close(4408, 'Request Timeout');
                } else {
                  logger.debug('Ping timeout, connection already closed', this.activeSocket?.readyState);
                }
              }, 2000);
          },
          pong: (received) => {
            logger.debug('Pong received', received);
            if (received) {
              clearTimeout(this.timedout);
            }
          },
        },
      });

      if (this.config.wsTeardown$) {
        this.autoDispose(
          this.config.wsTeardown$.subscribe(() => {
            if (this.clientWS) {
              this.clientWS.terminate();
            }
          }),
        );
      }
    }
  }

  query = async <Q extends QueryFn>(
    queryFn: Q,
    variables?: ExtractVariables<Q>,
    headers?: HeadersInit,
  ): Promise<ExtractResult<Q>> => {
    const authHeaders = await this.config.getAuthHeaders?.();

    return queryFn(this.request, variables, { ...authHeaders, ...headers });
  };

  querySuspense = <Q extends QueryFn>(
    queryFn: Q,
    variables?: ExtractVariables<Q>,
    headers?: HeadersInit,
  ): ExtractResult<Q> => {
    const key = queryFn.name + ':' + JSON.stringify(variables || {});

    return this.queryLoader.querySuspense({
      fetcher: async () => {
        const authHeaders = await this.config.getAuthHeaders?.();

        return queryFn(this.request, variables, { ...authHeaders, ...headers });
      },
      key,
    }).data;
  };

  request = async <R, V = never>(query: DocumentNode, variables?: V, headers?: HeadersInit): Promise<R> => {
    const name = getOperationAST(query)?.name?.value;

    logger.debug(`[Query - ${name}]`, variables);

    const result = this.config.scalarExchange.parse({
      operation: {
        query,
      },
      data: await this.gqlClientService.client.request<R>(query, variables || {}, headers),
    }).data;

    logger.debug(`[Query Result - ${name}]`, result);

    return result;
  };

  readonly upload = async <Result, Variables = never>(
    query: DocumentNode,
    variables?: Variables,
    headers?: HeadersInit,
  ): Promise<Result> => {
    const formData = new FormData();
    formData.append(
      'operations',
      JSON.stringify({
        query: print(query),
        variables,
      }),
    );

    const files: unknown[] = [];
    const fileMap: Record<string, string[]> = {};

    // todo: support multiple files upload
    if (typeof variables === 'object' && variables !== null && 'file' in variables) {
      files.push(variables.file);
      variables.file = null;
    }

    files.forEach((file, index) => {
      fileMap[index] = ['variables.file'];
      formData.append(index.toString(), file as File);
    });

    formData.append('map', JSON.stringify(fileMap));

    const result = await fetch(this.config.url, {
      method: 'POST',
      body: formData,
      headers,
    });

    const data = await result.json();

    return this.config.scalarExchange.parse({
      operation: {
        query,
      },
      data,
    }).data;
  };

  readonly subscription = <S extends SubscriptionFn>(
    subscription: S,
    variables?: ExtractVariables<S>,
  ): Observable<ExtractResult<S>> => {
    return subscription(this.getSubscription, variables);
  };

  readonly getSubscription = <R, V = never>(subscription: DocumentNode, variables?: V): Observable<R> => {
    if (!this.clientWS) return NEVER;

    const name = getOperationAST(subscription)?.name?.value;

    return new Observable<ExecutionResult<R, unknown>>((subscriber) => {
      logger.debug(`[Subscription - ${name}]`, variables);

      invariant(this.clientWS, 'Websocket client not initialized');

      return this.clientWS.subscribe<R>(
        {
          query: print(subscription),
          variables: variables as Record<string, unknown>,
        },
        subscriber,
      );
    }).pipe(
      retry(
        RetryStrategy({
          eagerDelay: 1000,
          label: `[Subscription - ${name}] connection lost`,
        }),
      ),
      map(
        ({ data }) =>
          this.config.scalarExchange.parse({
            operation: {
              query: subscription,
            },
            data,
          }).data,
      ),
      filter((data): data is R => Boolean(data)),
      // tap((data) => logger.debug(`[Subscription Result - ${name}]`, data)),
      share({
        resetOnComplete: false,
        resetOnError: false,
        resetOnRefCountZero: true,
      }),
    );
  };
}
