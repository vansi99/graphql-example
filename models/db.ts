import mongoose from 'mongoose'

const connect = (): void => {
    let uri: string = process.env.MONGO_URI || ''

    if (!uri) {
        console.error('mongo: uri is undefined')
    }

    mongoose.connect(uri).then(() => {
        console.log(`mongo: 🍱 mongodb connected - mongo_uri=${uri}`)
    }).catch((error) => {
        console.error(error)
        console.error('mongo: connect to mongod error, trying to reconnect...')
        setTimeout(connect, 3000)
    })
}

export default {
    connect
}