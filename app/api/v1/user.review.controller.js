const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const addReviewSchema = Joi.object({
    reviewDescription: Joi.string().required().messages({ 'string.empty': 'Review is required.' }).max(500),
    recipientId: Joi.string().required().messages({ 'string.empty': 'Recipient is required.' })
})

module.exports = function() {
    const baseRoute = basePath + 'reviews'

    this.post(baseRoute, authorization('review.create'), ValidatorRequest.validateRequest(addReviewSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserReviewService.create(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully created review', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(basePath + 'my/reviews', authorization('review.search'), (req, res) => {
        return new Promise((resolve, reject) => {
            UserReviewService.getallmyreviews(req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retrieve reviews', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(basePath + 'my/reviews/:id/hideUnhide', authorization('review.hideunhide'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            UserReviewService.hideUnhideReview(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully hide/unhide review', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute + '/public/:username', (req, res) => {
        return new Promise((resolve, reject) => {
            const username = req.params.username
            UserReviewService.getallreviewsbyusername(username)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retrieve reviews', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.post(baseRoute + '/swap', authorization('review.swap'), (req, res) => new Promise((resolve, reject) => {
        UserReviewService.swapOrder(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully sorted', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))

    this.get(baseRoute + '/:id/toggleprotect', authorization('review.protect'), (req, res) => new Promise((resolve, reject) => {
        const { id } = req.params
        UserReviewService.toggleProtect(id, req.user)
            .then(result => resolve(res.json(Response.Success.Custom('Successfully protected/unprotected.', result))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))
}