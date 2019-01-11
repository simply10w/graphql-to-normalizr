export interface Relation  { entity: string, name: string, type: 'array'|'object' }
export interface Entity { name: string, relations: Relation[] }
