import News from '../models/news'
import responseUtil from '../utils/response'
import { Context } from '../models/context'
import { GraphQLResolveInfo } from 'graphql'
import mongoose from 'mongoose'


const resolver = {
	Query: {
		getNews: async (
			_: any,
			args: {
				limit: number,
				offset: number,
				search: string,
				sort: mongoose.SortOrder,
			},
		) => {
			try {
				type Query = {
					$SearchNewsIndex?: {
						$search?: string
					},
					status: string
				}

				const query: Query = {
					status: 'active'
				}
				
				if (args.search) {
					query.$SearchNewsIndex = {
						$search: args.search
					}
				}
				
				const news = await News.find(query)
					.sort({ _id: args.sort })
					.skip(args.offset)
					.limit(args.limit)
					.lean()
									
				return responseUtil.success(news)
			} catch (error: any) {
				return responseUtil.error(error.message, 'getNews')
			}
		},
		
		getDetailNews: async (_: any, args: { _id: string }) => {
			try {
				const news = await News
					.findOne({ _id: args._id })
					.populate('publisher', 'email username')
					.populate('categories', 'name description')
					.lean()
									
				return responseUtil.success(news)
			} catch (error: any) {
				return responseUtil.error({ message: error.message }, 'getNews')
			}
		},
		
		getPublisherNews: async (_: any, args: any, ctx: Context) => {
			try {
				if (!ctx._id) {
					throw Error('Unauthorized')
				}
				
				const news = await News.find({ publisher: ctx._id }).lean()

				return responseUtil.success(news)
			} catch (error: any) {
				return responseUtil.error({ message: error.message }, 'getPublisherNews')
			}
		}
	},
	Mutation: {
		createNews: async (
			_: any,
			args: {
				inputObject: {
					title: string,
					thumbUrl: string,
					description: string,
					content: string,
					categories: string[],
				}
			},
			ctx: Context,
			info: GraphQLResolveInfo
		) => {
			try {
				if (!ctx._id) {
					throw Error('Unauthorized')
				}

				const result = await News.create({
					...args.inputObject,
					publisher: ctx._id,
					status: 'active'
				})

				return responseUtil.success(result)
			} catch (error: any) {

				return responseUtil.error({ message: error.message }, 'Mutation createNews')
			}
		},

		updateNews: async (
			_: any,
			args: {
				_id: string,
				inputObject: {
					title: string,
					thumbUrl: string,
					description: string,
					content: string,
					categories: [String],
				}
			},
			ctx: Context,
			info: GraphQLResolveInfo
		) => {
			try {
				if (!ctx._id) {
					throw Error('Unauthorized')
				}

				const result = await News.findOneAndUpdate({
					_id: args._id,
					publisher: ctx._id,
				}, {
					...args.inputObject
				})

				if (result) {
					return responseUtil.success('success')
				} else {
					throw Error('something error')
				}
			} catch (error: any) {

				return responseUtil.error({ message: error.message }, 'Mutation updateNews')
			}
		},

		deleteNews: async (
			_: any,
			args: { _id: string, },
			ctx: Context,
			info: GraphQLResolveInfo
		) => {
			try {
				if (!ctx._id) {
					throw Error('Unauthorized')
				}

				const result = await News.findOneAndUpdate(
					{
						_id: args._id,
						publisher: ctx._id,
					},
					{
						status: 'deleted'
					}
				)

				if (result) {
					return responseUtil.success('success')
				} else {
					throw Error('something error')
				}
			} catch (error: any) {
				return responseUtil.error({ message: error.message }, 'Mutation deleteNews')
			}
		},
	}
}


export default resolver