import * as jwt from 'jsonwebtoken'

const verifyToken = async (req: any): Promise<{email: string, username: string, _id: string}> => {
    const token = req?.headers?.authorization?.split('Bearer ')[1] || ''

    if (!token) {
        return {
            email: '',
            username: '',
            _id: ''
        }
    }

    try {
        const payload = <{ email: string; username: string; _id: string; iat: number }>(
            jwt.verify(token, <string>process.env.SECRET_KEY)
        )

        const { email, username, _id } = payload

        req.tokenData = {
            _id,
            email,
            username
        }

        return {
            email,
            username,
            _id,
        }
    } catch (error: any) {
        throw Error(error.messsage)
    }
}


export default verifyToken