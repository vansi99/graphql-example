import Category from '../models/category'
import responseUtil from '../utils/response'
import { Context } from '../models/context'
import { GraphQLResolveInfo } from 'graphql'


const resolver = {
	Query: {
		getCategories: async (_: any, args: {}) => {
			try {
                const categories = await Category.find().lean()
				
				return responseUtil.success(categories)
			} catch (error: any) {
				return responseUtil.error({ message: error.message }, 'getCategories')
			}
		},
	},
	Mutation: {
		createCategory: async (
			_: any,
			args: {
				inputObject: {
					name: string,
					description: string,
				}
			},
			ctx: Context,
			info: GraphQLResolveInfo
		) => {
			try {
				if (!ctx._id && !ctx.roles?.includes('admin')) {
					throw Error('Unauthorized')
				}

				const result = await Category.create({
					...args.inputObject,
				})

				return responseUtil.success(result)
			} catch (error: any) {
				return responseUtil.error({ message: error.message }, 'Mutation createCategories')
			}
		},
	}
}


export default resolver