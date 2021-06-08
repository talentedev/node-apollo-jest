const { ApolloError } = require('apollo-server-errors')
const jsonwebtoken = require('jsonwebtoken')
const { users } = require('../data')

require('dotenv').config()

const resolvers = {
    Query: {
        async me(_, args, { user }) {
            if(!user) throw new ApolloError('You are not authenticated!', 401);

            return await users.find(u => u.id === user.id)
        },

        async user(root, { id }, { user }) {
            try {
                if(!user) 
                return users.find(u => u.id === user.id)
            } catch (error) {
                throw new Error(error.message)
            }
        },

        async allUsers(root, args, { user }) {
            try {
                if (!user) throw new ApolloError('You are not authenticated!', 401);
                return users
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },

    Mutation: {
        async login(_, { email, password }) {
            try {
                const user = await users.find(u => u.email === email)

                if (!user) {
                    throw new ApolloError('No user with that email', 404);

                }

                const isValid = await password === user.password
                if (!isValid) {
                    throw new ApolloError('Incorrect password', 401);
                }

                // return jwt
                const token = jsonwebtoken.sign(
                    { id: user.id, email: user.email},
                    process.env.JWT_SECRET,
                    { expiresIn: '1d'}
                )
                
                return {
                   token, user
                }
            } catch (error) {
                throw new Error(error.message)
            }
        }

    },


}

module.exports = resolvers