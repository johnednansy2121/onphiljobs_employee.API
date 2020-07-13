const { basePath } = require('./apiConfig')
const authorization = require(basedir + '/helpers/authorization')
const Response = require(basedir + '/helpers/responseMiddleware')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const createEducationSchema = Joi.object({
    institutionName: Joi.string().required().messages({ 'string.empty': 'Institution name is required. ' }).max(80),
    institutionReason: Joi.string(),
    dateFinished: Joi.string().allow(""),
    notes: Joi.string().allow("").max(500),
    dateStarted: Joi.string().required().messages({ 'string.empty': 'Date started is required.' })
})

const updateEducationSchema = Joi.object({
    _id: Joi.string().required(),
    institutionName: Joi.string().required().messages({ 'string.empty': 'Institution name is required. ' }).max(80),
    institutionReason: Joi.string(),
    dateFinished: Joi.string().allow("", null),
    notes: Joi.string().allow("").max(500),
    dateStarted: Joi.string().required().messages({ 'string.empty': 'Date started is required.' })
})

module.exports = function() {
    const baseRoute = basePath + 'education'

    this.post(baseRoute, authorization('education.create'), ValidatorRequest.validateManyRequest(createEducationSchema), (req,res) => {
        return new Promise((resolve, reject) => {
            UserEducationService.insertMany(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully inserted education.', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message )))
        })
    })

    this.get(baseRoute, authorization('education.search'), (req, res) => {
        return new Promise((resolve, reject) => {
            UserEducationService.getAll(req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retreive educations.', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.put(baseRoute, authorization('education.update'), ValidatorRequest.validateRequest(updateEducationSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserEducationService.update(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully updated education data.', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.get(baseRoute + '/:id', authorization('education.get'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            UserEducationService.getById(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retreive record of education', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.delete(baseRoute + '/:id', authorization('education.delete'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            UserEducationService.removeById(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully removed education record', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.get(baseRoute + '/public/:username', (req, res) => {
        return new Promise((resolve, reject) => {
            const username = req.params.username
            UserEducationService.geteducationlistbyusername(username)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully fetch education records', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.post(baseRoute + '/swap', authorization('education.rearrange'), (req, res) => new Promise((resolve, reject) => {
        UserEducationService.swapOrder(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully sorted', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
    }))

    this.get(baseRoute + '/:id/toggleprotect', authorization('education.protect'), (req, res) => new Promise((resolve, reject) => {
        const { id } = req.params
        UserEducationService.toggleProtect(id, req.user)
            .then(result => resolve(res.json(Response.Success.Custom('Successfully protected/unprotected.', result))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))
}