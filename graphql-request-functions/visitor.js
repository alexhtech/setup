'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GraphQLRequestVisitor = void 0;
const tslib_1 = require('tslib');
const auto_bind_1 = tslib_1.__importDefault(require('auto-bind'));
const graphql_1 = require('graphql');
const visitor_plugin_common_1 = require('@graphql-codegen/visitor-plugin-common');
class GraphQLRequestVisitor extends visitor_plugin_common_1.ClientSideBaseVisitor {
  constructor(schema, fragments, rawConfig) {
    super(schema, fragments, rawConfig, {
      rawRequest: (0, visitor_plugin_common_1.getConfigValue)(rawConfig.rawRequest, false),
      extensionsType: (0, visitor_plugin_common_1.getConfigValue)(rawConfig.extensionsType, 'any'),
    });
    this._operationsToInclude = [];
    (0, auto_bind_1.default)(this);
    const importQueryTypesFrom = rawConfig.importQueryTypesFrom || '@/core/api/query-types';
    const typeImport = this.config.useTypeImports ? 'import type' : 'import';
    this._additionalImports.push(`${typeImport} { Observable } from 'rxjs';`);
    this._additionalImports.push(`${typeImport} { Request, GetSubscription } from '${importQueryTypesFrom}';`);
    this._externalImportPrefix = this.config.importOperationTypesFrom ? `${this.config.importOperationTypesFrom}.` : '';
  }
  OperationDefinition(node) {
    var _a;
    const operationName = (_a = node.name) === null || _a === void 0 ? void 0 : _a.value;
    if (!operationName) {
      // eslint-disable-next-line no-console
      console.warn(
        `Anonymous GraphQL operation was ignored in "typescript-graphql-request", please make sure to name your operation: `,
        (0, graphql_1.print)(node)
      );
      return null;
    }
    return super.OperationDefinition(node);
  }
  buildOperation(node, documentVariableName, operationType, operationResultType, operationVariablesTypes) {
    operationResultType = this._externalImportPrefix + operationResultType;
    operationVariablesTypes = this._externalImportPrefix + operationVariablesTypes;
    this._operationsToInclude.push({
      node,
      documentVariableName,
      operationType,
      operationResultType,
      operationVariablesTypes,
    });
    return null;
  }
  get sdkContent() {
    const extraVariables = [];
    const allPossibleActions = this._operationsToInclude
      .map((o) => {
        const operationName = o.node.name.value;
        const optionalVariables =
          !o.node.variableDefinitions ||
          o.node.variableDefinitions.length === 0 ||
          o.node.variableDefinitions.every((v) => v.type.kind !== graphql_1.Kind.NON_NULL_TYPE || v.defaultValue);
        if (o.node.operation === graphql_1.OperationTypeNode.SUBSCRIPTION) {
          return `${operationName}<R extends ${o.operationResultType}, V extends ${
            o.operationVariablesTypes
          }>(subscription: GetSubscription<R, V>, variables${optionalVariables ? '?' : ''}: V): Observable<R> {
        return subscription(${o.documentVariableName}, variables)
      }`;
        }
        return `${operationName}<R extends ${o.operationResultType}, V extends ${
          o.operationVariablesTypes
        }>(request: Request<R, V>, variables${optionalVariables ? '?' : ''}: V, headers?: HeadersInit): Promise<R> {
    return request(${o.documentVariableName}, variables, headers)
  }`;
      })
      .filter(Boolean)
      .map((s) => (0, visitor_plugin_common_1.indentMultiline)(s, 2));
    return `
${extraVariables.join('\n')}

${allPossibleActions.map((action) => `export function ${action};`).join('\n')}

`;
  }
}
exports.GraphQLRequestVisitor = GraphQLRequestVisitor;
