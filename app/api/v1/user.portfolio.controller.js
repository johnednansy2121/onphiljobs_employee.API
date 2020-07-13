const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const createPortfolioSchema = Joi.object({
    itemName: Joi.string().required().messages({ 'string.empty': 'Name or title is required.' }).max(80),
    itemImageUrl: Joi.string().required().messages({ 'string.empty': 'Image is required.' }),
    itemDescription: Joi.string().allow("").max(500),
    tags: Joi.array().allow("")
})

const updatePortfolioSchema = Joi.object({
    _id: Joi.string().required(),
    itemName: Joi.string().required().messages({ 'string.empty': 'Name or title is required.' }).max(80),
    itemImageUrl: Joi.string().required().messages({ 'string.empty': 'Image is required.' }),
    itemDescription: Joi.string().allow("").max(500),
    tags: Joi.array().allow("")
})

module.exports = function() {
    const baseRoute = basePath + 'portfolio'

    this.post(baseRoute, authorization('portfolio.create'), ValidatorRequest.validateRequest(createPortfolioSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserPortfolioService.create(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully created portfolio.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute + '/:id', (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            UserPortfolioService.getById(id)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retrieve portfolio.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute, authorization('portfolio.search'), (req, res) => {
        return new Promise((resolve, reject) => {
            UserPortfolioService.searchuserportfolio(req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retrieve portfolios.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.delete(baseRoute + '/:id', authorization('portfolio.delete'), (req, res) => {
        return new Promise((resolve ,reject) => {
            const id = req.params.id
            UserPortfolioService.delete(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully deleted portfolio.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.put(baseRoute, authorization('portfolio.update'), ValidatorRequest.validateRequest(updatePortfolioSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserPortfolioService.update(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully updated portfolio.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute + '/public/:username', (req, res) => {
        return new Promise((resolve, reject) => {
            const username = req.params.username
            UserPortfolioService.getportfoliosbyusername(username)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retrieve portfolios.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.post(baseRoute + '/swap', authorization('portfolio.swap'), (req, res) => new Promise((resolve, reject) => {
        UserPortfolioService.swapOrder(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully sorted.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))

    this.get(baseRoute + '/:id/toggleprotect', authorization('portfolio.protect'), (req, res) => new Promise((resolve, reject) => {
        const { id } = req.params
        UserPortfolioService.toggleProtect(id, req.user)
            .then(result => resolve(res.json(Response.Success.Custom('Successfully protected/unprotected.', result))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))
}
