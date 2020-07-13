const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const Joi = require('@hapi/joi')
const requestValidator = require(basedir + '/helpers/requestValidators')

const createPaymentMethodSchema = Joi.object({
    accountName: Joi.string().required().messages({ 'string.empty': 'Account Name is required.'}),
    cardNumber: Joi.string().required().messages({ 'string.empty': 'Card Number is required.' }),
    expiryMonth: Joi.string().min(2).max(2).required().messages({ 'string.empty': 'Expiration Month is required.'}),
    expiryYear: Joi.string().min(4).max(4).required().messages({ 'string.empty': 'Expiration Year is required.' }),
    cvc: Joi.string().min(3).max(3).required(),
    address1: Joi.string().required(),
    address2: Joi.string().allow(''),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required()
})

const updatePaymentMethodSchema = Joi.object({
    _id: Joi.string().required(),
    accountName: Joi.string().required().messages({ 'string.empty': 'Account Name is required.'}),
    cardNumber: Joi.string().required().messages({ 'string.empty': 'Card Number is required.' }),
    expiryMonth: Joi.string().min(2).max(2).required().messages({ 'string.empty': 'Expiration Month is required.'}),
    expiryYear: Joi.string().min(4).max(4).required().messages({ 'string.empty': 'Expiration Year is required.' }),
    cvc: Joi.string().min(3).max(3).required(),
    address1: Joi.string().required(),
    address2: Joi.string().allow(''),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required()
})

module.exports = function() {
    const baseRoute = basePath + 'paymentmethod'

    this.post(baseRoute, authorization('paymentmethod.create'), requestValidator.validateRequest(createPaymentMethodSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            PaymentMethodService.create(req.body, req.user)
            .then(response => resolve(res.json(Response.Success.Custom('successfully created payment method.', response))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute, authorization('paymentmethod.search'), (req, res) => {
        return new Promise((resolve, reject) => {
            PaymentMethodService.getall(req.user)
            .then(response => resolve(res.json(Response.Success.Custom('successfully retrieve payment methods.', response))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.put(baseRoute, authorization('paymentmethod.update'), requestValidator.validateRequest(updatePaymentMethodSchema), (req, res) => new Promise((resolve, reject) => {
        PaymentMethodService.update(req.body, req.user)
        .then(response => resolve(res.json(Response.Success.Custom('successfully updated payment method.', response))))
        .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))
}