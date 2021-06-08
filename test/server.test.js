const { ApolloServer } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const typeDefs = require('../src/schema/schema')
const resolvers = require('../src/resolvers/resolvers')

// create a new instance of our server (not listening on any port)
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const { query } = createTestClient(server);

// graphl query
const LOGIN = `
    mutation login($email: String!, $password: String!) {
        login(email: $email password: $password){
            token
            user {
                email
                id
                name
            }
        }
    }
`;

test('should login successfully', async () => {
    
    const response = await query({
        mutation: LOGIN,
        variables: {
            email: "alice@email.com",
            password: "password"
        }
    });

    expect(response.data.login.user.email).toEqual('alice@email.com');
});

test('should not login with 404 not found', async () => {
    
    const response = await query({
        mutation: LOGIN,
        variables: {
            email: "notfound@email.com",
            password: "password"
        }
    });

    expect(response.errors[0].message).toEqual('No user with that email');
});

test('should not login with 401 unauthrized', async () => {
    
    const response = await query({
        mutation: LOGIN,
        variables: {
            email: "alice@email.com",
            password: "password123"
        }
    });

    expect(response.errors[0].message).toEqual('Incorrect password');
});