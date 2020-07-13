const { basePath } = require('./apiConfig')
const authorization = require(basedir + '/helpers/authorization')
const Response = require(basedir + '/helpers/responseMiddleware')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const createExperienceSchema = Joi.object({
    organizationName: Joi.string().required().messages({ 'string.empty': 'Organization name is required.' }).max(80),
    jobTitle: Joi.string().required().messages({ 'string.empty': 'Job title is required.' }).max(80),
    jobDescription: Joi.string().allow("").max(500),
    dateStarted: Joi.string().required().messages({ 'string.empty': 'Date started is required.' }),
    location: Joi.string().allow(''),
    dateFinished: Joi.string().allow("", null)
})

const updateExperienceSchema = Joi.object({
    _id: Joi.string().required(),
    organizationName: Joi.string().required().messages({ 'string.empty': 'Organization name is required.' }).max(80),
    jobTitle: Joi.string().required().messages({ 'string.empty': 'Job title is required.' }).max(80),
    jobDescription: Joi.string().allow("").max(500),
    location: Joi.string().allow(''),
    dateStarted: Joi.string().required().messages({ 'string.empty': 'Date started is required.' }),
    dateFinished: Joi.string().allow("", null)
})

module.exports = function() {
    const baseRoute = basePath + 'experiences'

    // this.post(baseRoute, authorization('experience.create'), ValidatorRequest.validateRequest(createExperienceSchema), (req, res) => {
    //     return new Promise((resolve, reject) => {
    //         UserExperienceService.create(req.body, req.user)
    //             .then(result => resolve(res.json(Response.Success.Custom('Successfully created work experience.', result))))
    //             .catch(err => reject(Response.Error.Custom(res, err)))
    //     })
    // })

    this.post(baseRoute, authorization('experience.create'), ValidatorRequest.validateManyRequest(createExperienceSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserExperienceService.insertMany(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully created work experience records.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute + '/:id', authorization('experience.get'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            UserExperienceService.getById(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retrieve work experience record.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute, authorization('experience.get'), (req, res) => {
        return new Promise((resolve, reject) => {
            UserExperienceService.search(req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retrieve work experience records.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.put(baseRoute, authorization('experience.update'), ValidatorRequest.validateRequest(updateExperienceSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserExperienceService.update(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully updated work experience record.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.delete(baseRoute + '/:id', authorization('experience.delete'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            UserExperienceService.remove(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully remove work experience record.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute + '/public/:username', (req, res) => {
        return new Promise((resolve, reject) => {
            const username = req.params.username
            UserExperienceService.getexperiencesbyusername(username)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retrieve work experience records.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.post(baseRoute + '/swap', authorization('experience.swap'), (req, res) => new Promise((resolve, reject) => {
        UserExperienceService.swapOrder(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully sorted.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))

    this.get(baseRoute + '/:id/toggleprotect', authorization('experience.protect'), (req, res) => new Promise((resolve, reject) => {
        const { id } = req.params
        UserExperienceService.toggleProtect(id, req.user)
            .then(result => resolve(res.json(Response.Success.Custom('Successfully protected/unprotected.', result))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))
}