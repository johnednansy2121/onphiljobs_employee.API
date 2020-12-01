const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const userLoginSchema = Joi.object({
    userName: Joi.string().required().messages({ 'string.empty': 'username is required.' }),
    password: Joi.string().required().min(6).messages({ 'string.empty': 'password is required.', 'string.min': 'password minimum length is 6.' })
})

const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().min(6),
    phone: Joi.string().allow(''),
    on2FA: Joi.boolean().default(false),
    userName: Joi.string().required().messages({ 'string.empty': 'username is required.' })
})

module.exports = function(){
    const baseRoute = basePath + 'user'

    this.post(baseRoute + '/signup', ValidatorRequest.validateRequest(signUpSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            const tag  = req.query.tag ? req.query.tag : ''
            UserService.signup({ ...req.body, tag })
                .then(data => resolve(
                    res.json(Response.Success.Custom('successfully signed up a user.', data
                    ))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.post(baseRoute + '/login', ValidatorRequest.validateRequest(userLoginSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserService.login(req.body)
                .then(data => resolve(res.json(Response.Success.Custom('successfully logged in user.', { ...data }))))
                .catch(error => { reject(Response.Error.Custom(res, error.message)) })
        })
    })

    this.get(baseRoute + '/verify/:id', (req, res) => {
        return new Promise((resolve, reject) => {
            const code = req.params.id
            UserService.verify(code)
                .then(token => resolve(res.json(Response.Success.Custom('Successfully verified email.', token))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.get(baseRoute, authorization('user'), (req, res) => {
        return new Promise((resolve, reject) => {
            const { _id } = req.user
            UserService.getUserById(_id)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retrieved your user data.', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.post(baseRoute + '/2FA', async(req, res) => {
        try {
            const result = await UserService.twoFALogin(req.body)

            res.status(200).json({ message: 'Successfully verified 2 Factor Authentication', model: result, successful: true })
        } catch(err) {
            res.status(400).json({ message: err.message, successful: false })
        }
    })

    this.get(baseRoute + '/2FA/settings', authorization('2FA'), async(req, res) => {
        try {
            const result = await UserService.get2FASettings(req.user)

            res.status(200).json({ model: result, message: 'Successfully fetch 2FA Settings.', successful: true })
        } catch(err) {
            res.status(400).json({ message: err.message, successful: false })
        }
    })

    this.put(baseRoute + '/2FA/settings', authorization('2FA'), async(req, res) => {
        try {
            const result = await UserService.change2FASettings(req.body, req.user)

            res.status(200).json({ model: result, message: 'Successfully updated 2FA Settings', successful: true })
        } catch(err) {
            res.status(400).json({ message: err.message, successful: false })
        }
    })
}
