const validateRequest = (schema) => {
    return (req, res, next) => {
        try  {
            const { error } = schema.validate(req.body)
            if(error) {
                res.status(400).json({ message: error.details[0].message })
            } else {
                next()
            }
        }
        catch(err) {
            res.status(400).json({ message: err.message })
        }
    }
}

const validateManyRequest = (schema) => {
    return (req, res, next) => {
        try {
            const datas = req.body
            if (datas.length <= 0) {
                res.status(400).json({ message: 'no items in request.'})
            } else {
                let errorRes = false
                let message = ''
                datas.forEach(x => {
                    let { error } = schema.validate(x)
                    if (error) {
                        errorRes = true
                        message = error.details[0].message
                    }
                })
                if (errorRes) res.status(400).json({ message })
                else {
                    next()
                }
            }
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    }
}

module.exports = RequestValidator = {
    validateRequest,
    validateManyRequest
}