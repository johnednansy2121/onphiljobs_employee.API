const jwt = require('jsonwebtoken')

module.exports = (scope) => {
    return (req, res, next) => {
        if(scope) {
            const authorization = req.headers.authorization
            if(authorization) {
                const token = authorization.split(' ')[1]
                if (!token) res.status(401).json({ message: 'Bearer not found', successful: false })
                else {
                    jwt.verify(token, Configuration.JWT_KEY, (error, decoded) => {
                        if (error)
                            res.status(401).json({ message: error.message, successful: false })
                        else {
                            const { email } = decoded

                            UserModel.findOne({ email }, (error, data) => {
                                if(error) res.status(401).json({ message: 'unauthorized access', successful: false })
                                else {
                                    const { _id } = data
                                    req.user = { _id }
                                    next()
                                }
                            })
                        }
                    })
                }
            } else
            res.status(401).json({ message: 'unauthorized access', successful: false })
        } else {
            next()
        }
    }
}