import User from '../models/user'
import responseUtil from '../utils/response'
import * as jwt from 'jsonwebtoken'
// import { composeResolvers, ResolversComposition, ResolversComposerMapping } from '@graphql-tools/resolvers-composition'
import { Context } from '../models/context'
import { GraphQLResolveInfo } from 'graphql'


const resolver = {
    Query: {
        getPublisher: async () => {
            try {
                const users = await User.find({ roles: 'publisher' }).lean()
                return responseUtil.success(users)
            } catch (error: any) {
                return responseUtil.error({message: error.message}, 'Query getAllUser')
            }
        },
        getToken: async (_: any, param: { email: string, password: string }) => {
            try {
                const user = await User.findOne(param).lean()

                if (user) {
                    return responseUtil.success(
                        jwt.sign({ _id: user._id, email: user.email, username: user.username, roles: user.roles }, 
                        <string>process.env.SECRET_KEY)
                    )
                } else {
                    throw Error('Email or password is wrong')
                }
            } catch (error: any) {
                return responseUtil.error({ message: error.message }, 'Login')
            }
        }
      },
    Mutation: {
        addUser: async (
                _: any,
                args: { inputObject: { username: string, password: string, email: string, roles: string[] }},
                ctx: Context,
                info: GraphQLResolveInfo
        ) => {
            try {
                if (!ctx._id) {
                    throw Error('Unauthorized')
                }

                const userExist = await User.findOne({ username: args.inputObject.username, email: args.inputObject.email })

                if (userExist) {
                    throw Error('Username or email is available')
                }

                const user = await User.create(args.inputObject)

                return responseUtil.success(user)
            } catch (error: any) {

                return responseUtil.error({ message: error.message }, 'Mutation addUser')
            }
        },
    }
}


export default resolver