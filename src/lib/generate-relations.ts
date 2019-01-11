import { buildSchema, GraphQLObjectType } from 'graphql';
import { Relation, Entity } from './models';

export function generateRelationsString(graphqlSchemaAsString: string): string {
  const graphqlSchema = buildSchema(graphqlSchemaAsString);
  const typeMap = graphqlSchema.getTypeMap();
  const defaultTypes = new Set(['String', 'Boolean', 'Int']);

  const entityTypes = Object.keys(typeMap)
    .filter((key: string) => !key.startsWith('__'))
    .filter(key => !defaultTypes.has(key))
    .map(key => typeMap[key] as GraphQLObjectType);

  const entityTypesTables = entityTypes.reduce(
    (table, type) => table.set(type.name, type),
    new Map<string, GraphQLObjectType>()
  );

  const graph = entityTypes.reduce(
    (table, type) => {
      table[type.name] = {
        name: type.name,
        relations: extractRelations(type, entityTypesTables)
      };
      return table;
    },
    {} as Record<string, Entity>
  );

  return JSON.stringify(graph);
}

function extractRelations(
  type: GraphQLObjectType,
  typesTable: Map<string, GraphQLObjectType>
) {
  return type.astNode.fields.reduce(
    (nodes, node) => {
      switch (node.type.kind) {
        case 'ListType':
          {
            if (node.type.type.kind === 'NamedType') {
              const entityType = node.type.type.name.value;
              if (typesTable.get(entityType)) {
                nodes.push({
                  entity: entityType,
                  name: node.name.value,
                  type: 'array'
                });
              }
            }
          }
          break;

        case 'NamedType':
          {
            const entityType = node.type.name.value;
            if (typesTable.get(entityType)) {
              nodes.push({
                entity: entityType,
                name: node.name.value,
                type: 'object'
              });
            }
          }
          break;
      }

      return nodes;
    },
    [] as Relation[]
  );
}
