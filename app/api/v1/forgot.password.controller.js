const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require('../../helpers/authorization')
const Joi = require('@hapi/joi')
const { validateRequest } = require('../../helpers/requestValidators')

const changePasswordRequestSchema = Joi.object({
    oldPassword: Joi.string().required().min(6),
    newPassword: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().min(6)
})


module.exports = function() {
    const baseRoute = basePath + 'forgotpassword'

    this.post(baseRoute, (req, res) => {
        return new Promise((resolve, reject) => {
            ForgotPasswordService.create(req.body)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully requested to forgot password', response))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.put(baseRoute, (req, res) => {
        return new Promise((resolve, reject) => {
            ForgotPasswordService.changepassword(req.body)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully change password.', response))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.post(basePath + 'changepassword', authorization('changepassword'),  validateRequest(changePasswordRequestSchema), async(req, res) => {
        try {
            const result = await ForgotPasswordService.userChangePassword(req.body, req.user)

            res.status(200).json({ model: result, message: 'Successfully change password.', successful: true })
        } catch(err) {
            res.status(400).json({ message: err.message, successful: false })
        }
    })
}