const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const Joi = require('@hapi/joi')
const requestValidator = require(basedir + '/helpers/requestValidators')


const createSubscriptionSchema = Joi.object({
    paymentMethodId: Joi.string().required(),
    planId: Joi.string().required(),
    promoCode: Joi.string().allow('')
})

module.exports = function() {
    const baseRoute = basePath + 'subscription'

    this.post(baseRoute, authorization('subscription.create'), requestValidator.validateRequest(createSubscriptionSchema), async(req, res) => {
        try {
            const result = await SubscriptionService.subscribe(req.body, req.user)

            res.status(200).json({ successful: true, message: 'Successfully subscribe as pro member.', model: result })

        } catch(err) {
            res.status(400).json({ successful: false, message: err.message })
        }
    })

    this.get(baseRoute + '/unsubscribe', authorization('subscription.unsubscribe'), async(req, res) => {
        try {
            const result = await SubscriptionService.unsubscribe(req.user)

            res.status(200).json({ successful: true, message: 'Successfully unsubscribe to a plan.', model: result })
        } catch(err) {
            res.status(400).json({ successful: false, message: err.message })
        }
    })

    this.post(basePath + 'stripe/webhook', async(req, res) => {
        try {
            const result = await SubscriptionService.webhook(req.body)

            res.status(200).json({ successful: true })
        } catch(err) {
            res.status(400).json({ successful: false, message: err.message })
        }
    })
}