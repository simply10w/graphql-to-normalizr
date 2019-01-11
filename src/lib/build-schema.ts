import { Schema, schema } from 'normalizr';
import { Entity } from './models';

export function buildNormalizrSchemas<Types extends string>(
  graphAsString: string,
  identifiers: Record<Types, string> = {} as Record<Types, string>
) {
  let graph = JSON.parse(graphAsString);
  let schemaTable: Record<Types, Schema> = {} as Record<Types, Schema>;

  Object.keys(graph).forEach(key => {
    const entity = graph[key];
    if (entity) processEntity(entity);
  });

  function processEntity(entity: Entity) {
    if (schemaTable[entity.name]) return;

    let entitySchema = new schema.Entity(entity.name, undefined, {
      idAttribute: identifiers[entity.name]
    });
    schemaTable[entity.name] = entitySchema;

    entity.relations.forEach(relation => {
      let relatedEntity = graph[relation.entity];
      let relatedSchema = schemaTable[relatedEntity.name];

      if (!relatedSchema) {
        processEntity(relatedEntity);
        relatedSchema = schemaTable[relatedEntity.name];
      }

      if (relatedSchema) {
        if (relation.type === 'object') {
          entitySchema.define({ [relation.name]: relatedSchema });
        } else if (relation.type === 'array') {
          entitySchema.define({ [relation.name]: [relatedSchema] });
        }
      }
    });
  }

  return schemaTable;
}
