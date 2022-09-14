import user from './user'
import news from './news'
import category from './category'

const resolvers = {
    Query: {
        ...user.Query,
        ...news.Query,
        ...category.Query,
    },

    Mutation: {
        ...user.Mutation,
        ...news.Mutation,
        ...category.Mutation,
    },
}

export default resolvers