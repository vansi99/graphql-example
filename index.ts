import 'dotenv/config'

import { ApolloServer } from 'apollo-server-express'
import schema from './Schema'
import express from 'express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'
import db from './models/db'
import jwtVerifyToken from './utils/jwt'

async function startApolloServer(schema: any) {
    const port = process.env.PORT || 4000
    const app = express()
    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: async ({ req }) => {
            return await jwtVerifyToken(req);
        },
    }) as any

    await server.start()

    server.applyMiddleware({ app })

    db.connect()

    await new Promise<void>((resolve) =>
        httpServer.listen({ port }, resolve)
    )

    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
}

startApolloServer(schema)