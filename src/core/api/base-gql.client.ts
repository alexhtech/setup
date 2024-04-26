import { DocumentNode } from 'graphql';
import { BatchRequestDocument, GraphQLClient } from 'graphql-request';

type BatchedRequest = {
  promise: Promise<BatchedResult>;
  documents: BatchRequestDocument[];
  headers?: HeadersInit;
};

type Result = {
  data: any;
};

type BatchedResult = [Result, ...Result[]];

type Config = {
  url: string;
};

export abstract class BaseGQLClientService {
  readonly client: GraphQLClient;

  private readonly batchedRequests: BatchedRequest[] = [];

  constructor(private readonly config: Config) {
    this.client = new GraphQLClient(config.url, { fetch });
  }

  readonly query = async <R, Variables = unknown>(
    query: DocumentNode,
    variables?: Variables,
    headers?: HeadersInit,
  ): Promise<R> => {
    const batchId = this.batchedRequests.length ? this.batchedRequests.length - 1 : 0;

    const result = this.putInQueue(
      batchId,
      {
        document: query,
        variables: variables || {},
      },
      headers,
    );

    const index = result.documents.length - 1;

    return result.promise.then((result) => result[index] as R);
  };

  private runTimer = (): Promise<BatchedResult> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const batchedRequest = this.batchedRequests.shift();

        if (!batchedRequest) {
          return reject();
        }

        const { documents, headers } = batchedRequest;

        this.client
          .batchRequests(documents, headers)
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      }, 50);
    });
  };

  private putInQueue = (id: number, document: BatchRequestDocument, headers?: HeadersInit): BatchedRequest => {
    const batchedRequest = this.batchedRequests[id] || {
      promise: this.runTimer(),
      documents: [],
    };

    batchedRequest.documents.push(document);

    if (headers) {
      batchedRequest.headers = headers;
    }

    this.batchedRequests[id] = batchedRequest;

    return batchedRequest;
  };
}
