const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const createSkillSchema = Joi.object({
    skillName: Joi.string().required().messages({ 'string.empty': 'Skill name is required.' }).max(80),
    skillLevel: Joi.number(),
    yearsOfExperience: Joi.number(),
    notes: Joi.string().allow("").max(500)
})

const updateSkillSchema = Joi.object({
    _id: Joi.string().required(),
    skillName: Joi.string().required().messages({ 'string.empty': 'Skill name is required.' }).max(80),
    skillLevel: Joi.number(),
    yearsOfExperience: Joi.number(),
    notes: Joi.string().allow("").max(500)
})

module.exports = function() {
    const baseRoute = basePath + 'skills'

    this.post(baseRoute, authorization('skill.create'), ValidatorRequest.validateManyRequest(createSkillSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserProfileSkillService.insertMany(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully inserted many skills.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    // this.post(baseRoute, authorization('skill.create'), ValidatorRequest.validateRequest(createSkillSchema), (req, res) => {
    //     return new Promise((resolve, reject) => {
    //         UserProfileSkillService.create(req.body, req.user)
    //             .then(result => resolve(res.json(Response.Success.Custom('Successfully created skill details.', result))))
    //             .catch(err => reject(Response.Error.Custom(res, err)))
    //     })
    // })

    this.get(baseRoute + '/:id', authorization('skill.get'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            UserProfileSkillService.getById(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retreive skill details.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute, authorization('skill.search'), (req, res) => {
        return new Promise((resolve, reject) => {
            UserProfileSkillService.getAll(req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retreive skill records.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.put(baseRoute, authorization('skill.update'), ValidatorRequest.validateRequest(updateSkillSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserProfileSkillService.update(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully updated skill details.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.delete(baseRoute + '/:id', authorization('skill.delete'), (req, res) => {
        return new Promise((resolve ,reject) => {
            const id = req.params.id
            UserProfileSkillService.delete(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully remove skill details.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute + '/public/:username', (req, res) => {
        return new Promise((resolve, reject) => {
            const username = req.params.username
            UserProfileSkillService.getskillsbyusername(username)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retreive skill records.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.post(baseRoute + '/swap', authorization('skill.sort'), (req, res) => new Promise((resolve, reject) => {
        UserProfileSkillService.swapOrder(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully sorted.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))

    this.get(baseRoute + '/:id/toggleprotect', authorization('skill.protect'), (req, res) => new Promise((resolve, reject) => {
        const { id } = req.params
        UserProfileSkillService.toggleProtect(id, req.user)
            .then(result => resolve(res.json(Response.Success.Custom('Successfully protected/unprotected.', result))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))
}