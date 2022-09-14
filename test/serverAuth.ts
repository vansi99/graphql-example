import 'dotenv/config'

import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'
import db from '../models/db'
import jwtVerifyToken from '../utils/jwt'
import typeDefs from './schema'
import resolvers from '../resolvers/index'

const app = express()
const httpServer = http.createServer(app)

const serverTest = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req }) => {
      return {
        _id: '6320fa9bdc6ea5f47fe091a0',
        email: 'vansido1@gmail.com',
        username: 'vansido1'
      }
    },
}) as any

db.connect()

export = serverTest
