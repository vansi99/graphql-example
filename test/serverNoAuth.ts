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
      return await jwtVerifyToken(req);
    },
}) as any

db.connect()

export = serverTest
