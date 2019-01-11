import { buildNormalizrSchemas, generateRelationsString } from "./lib";
import { normalize } from "normalizr";

const graphqlSchema = `
    type User {
        id: String
        name: String
        brother: User
        parents: [User]
    }

    type Comment {
        commenter: User
        guid: String 
    }
    
    type Post { 
        id: String
        author: User
        comments: [Comment]
    } 
`;
const relationsGraphString = generateRelationsString(graphqlSchema);

interface User {
    id: string;
    brother?: User;
    parents?: User[];
    name?: string;
    phone?: string;
}

interface Comment {
    guid: string;
    commenter: User;
}

interface Post {
    id: string;
    title?: string;
    author: User;
    comments: Partial<Comment>[];
}

const schemas = buildNormalizrSchemas<'Post'|'Comment'|'User'>(relationsGraphString, {
    Post: 'id',
    Comment: 'guid',
    User: 'id'
});

function normalizePost(post: Post) {
    return normalize(post, schemas.Post);
}

const post: Post = {
    id: 'post1',
    title: 'Post title',
    author: { 
        id: 'user1',
        name: 'User 1 name',
        brother: {
            id: 'user3',
            phone: '33333',
            name: 'user 4 name'
        },
        parents: [
            { id: 'user2', phone: '22222' },
            { id: 'user4', phone: '44444', name: 'User 4 Name' }
        ]
    },
    comments: [
        {
            guid: 'comment1',
            commenter: {
                id: 'user2',
                name: 'User 2 name'
            }
        }, 
        {
            guid: 'comment2',
            commenter: { 
                id: 'user3',
                name: 'User 3 name'
            }
        }
    ]
}

const print = (obj) =>  JSON.stringify(obj, null, 4);
// main
const main = document.getElementById("js-main");
if (main) {
    const normalized = normalizePost(post);
    console.log(normalized);
    main.textContent = print(normalized);
}