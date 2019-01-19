# Graphql schema to normalizr schema

Helper functions that allow you to build normalizr schemas from graphql schemas.

A minimum TypeScript app with [Parcel Bundler](https://parceljs.org/).

For more details, see [src/](./src/).

## Usage

To play around [StackBlitz](https://stackblitz.com/edit/typescript-graphql-schema-to-normalizr-schema).

## Example

```ts
import { normalize } from "normalizr";
import { buildNormalizrSchemas, generateRelationsString } from "./lib";

const graphqlSchema = `
    type User {
        id: String
        name: String
        parents: [User]
    }

    type Home {
        guid: String
        address: String
        tenants: [User]
    }
`;

const relationsGraphString = generateRelationsString(graphqlSchema);
const schemas = buildNormalizrSchemas<'User'|'Home'>(relationsGraphString, {
    User: 'id',
    Home: 'guid'
});

const home = {
    guid: 'home1',
    address: 'Home Address',
    tenants: [
        { id: 'user1', name: 'User 1', parents: [
            { id: 'user2', name: 'User 2' },
            { id: 'user4', name: 'User 4' }
        ] },
        { id: 'user3', name: 'User 3', parents: [
            { id: 'user2', name: 'User 2' },
            { id: 'user5' }
        ] },
    ] 
}

const normalized = normalize(home, schemas.Home);

```

The output will be:

```ts
{
    entities: {
        Home: {
            'home1': { guid: 'home1', address: 'Home Address', tenants: ['user1', 'user3']}
        },
        User: {
            'user1': { id: 'user1', name: 'User 1', parents: ['user2', 'user4'] }
            'user2': { id: 'user2', name: 'User 2', }
            'user3': { id: 'user3', name: 'User 3', parents: ['user2', 'user5'] }
            'user4': { id: 'user4', name: 'User 4' }
            'user5': { id: 'user5',  }

        }
    }
}

```


### Installation

    yarn install

### Development

Launch development server.

    yarn start
    
## Author

- [github/simply10w](https://github.com/simply10w)
- [twitter/nbdsimply](https://twitter.com/nbdsimply)

## License

MIT © simply10w
