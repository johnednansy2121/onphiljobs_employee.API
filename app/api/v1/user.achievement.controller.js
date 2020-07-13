const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const createAchievementSchema = Joi.object({
    achievementName: Joi.string().required().messages({ 'string.empty': 'Achievement name is required.' }).max(80),
    achievementDescription: Joi.string().allow("").max(500),
    dateStarted: Joi.string().required().messages({ 'string.empty': 'Date started is required.' }),
    dateFinished: Joi.string().allow("")
})

const updateAchievementSchema = Joi.object({
    _id: Joi.string().required(),
    achievementName: Joi.string().required().messages({ 'string.empty': 'Achievement name is required.' }).max(80),
    achievementDescription: Joi.string().allow("").max(500),
    dateStarted: Joi.string().required().messages({ 'string.empty': 'Date started is required.' }),
    dateFinished: Joi.string().allow("", null)
})

module.exports = function() {
    const baseRoute = basePath + 'achievements'

    // this.post(baseRoute, authorization('achievement.create'), ValidatorRequest.validateRequest(createAchievementSchema), (req, res) => {
    //     return new Promise((resolve, reject) => {
    //         UserAchievementService.create(req.body, req.user)
    //             .then(result => resolve(res.json(Response.Success.Custom('successfully created achievement record.', result))))
    //             .catch(err => reject(Response.Error.Custom(res, err)))
    //     })
    // })

    this.put(baseRoute, authorization('achievement.update'), ValidatorRequest.validateRequest(updateAchievementSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserAchievementService.update(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('successfully updated achievement record.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute, authorization('achievement.search'), (req, res) => {
        return new Promise((resolve, reject) => {
            UserAchievementService.search(req.user)
                .then(result => resolve(res.json(Response.Success.Custom('successfully get achievement records.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.get(baseRoute + '/:id', authorization('achievement.get'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            UserAchievementService.getById(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('successfully get achievement record.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.delete(baseRoute + '/:id', authorization('achievement.delete'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            UserAchievementService.delete(id, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('successfully deleted achievement record.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.post(baseRoute, authorization('achievement.create'), ValidatorRequest.validateManyRequest(createAchievementSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserAchievementService.insertMany(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('successfully created achievement records.', result))))
                .catch(err =>{reject(Response.Error.Custom(res, err.message))})
        })
    })

    this.get(baseRoute + '/public/:username', (req, res) => {
        return new Promise((resolve, reject) => {
            const username = req.params.username
            UserAchievementService.getachievementsbyusername(username)
                .then(result => resolve(res.json(Response.Success.Custom('successfully fetch  achievement records.', result))))
                .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })

    this.post(baseRoute + '/swap', authorization('achievement.sort'), (req, res) => new Promise((resolve, reject) => {
        UserAchievementService.sortOrder(req.body, req.user)
            .then(result => resolve(res.json(Response.Success.Custom('successfully sorted', result))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))

    this.get(baseRoute + '/:id/toggleprotect', authorization('achievement.proctect'), (req, res) => new Promise((resolve, reject) => {
        const { id } = req.params
        UserAchievementService.toggleProtect(id, req.user)
            .then(result => resolve(res.json(Response.Success.Custom('successfully mark as proctected/unprotected', result))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))
}