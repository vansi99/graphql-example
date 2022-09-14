import { model, Schema } from 'mongoose'

interface INews {
    title: string
    thumbUrl: string
    description: string
    content: string
    categories: Array<any>,
    publisher: any,
    readNumber: number
}

const NewsSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        thumbUrl: { type: String, required: true },
        description: { type: String, required: true },
        content: { type: String, required: true },
        status: {type: String, required: true },
    
        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }],
    
        publisher: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        
        readNumber: {
            type: Number,
            default: 0
        }
    }
)

NewsSchema.index({ _id: -1, status: 1, })

NewsSchema.index(
    {
        _id: -1,
        title: 'text',
        description: 'text',
        content: 'text',
    },
    {
        weights: {
            title: 1,
            description: 5,
            content: 10,
        },
        name: 'SearchNewsIndex'
    }
)


export default model<INews>('News', NewsSchema)