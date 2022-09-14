import { model, Schema } from 'mongoose'

interface IUser {
    username: string
    email: string
    password: string
    roles: Array<string>
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    roles: [String]
})


export default model<IUser>('User', UserSchema)