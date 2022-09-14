import 'graphql-import-node'
import * as userRootDefs from './schemas/user.graphql'
import * as newsRootDefs from './schemas/news.graphql'
import * as categoryRootDefs from './schemas/category.graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from './resolvers/index'

const schema = makeExecutableSchema({
    typeDefs: [userRootDefs, newsRootDefs, categoryRootDefs],
    resolvers,
})

export default schema
