import { model, Schema } from 'mongoose'

interface ICategory {
    name: string
    description: string
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
})


export default model<ICategory>('Category', CategorySchema)