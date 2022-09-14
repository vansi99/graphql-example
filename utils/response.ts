let responseUtil = {
    success: (data: any) => {
        return { data: data }
    },

    error: (error: { message: string }, caller: string) => {
        return {
            error: `${caller}: ${error.message}`
        }
    }
}

export default responseUtil