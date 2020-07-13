const { basePath } = require('./apiConfig');
const Response = require(basedir + '/helpers/responseMiddleware');
const authorization = require(basedir + '/helpers/authorization');
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const diarySchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required()
})

const updateDiarySchema = Joi.object({
    _id: Joi.string().required(),
    title: Joi.string().required(),
    body: Joi.string().required()
})

module.exports = function() {

    //Route Constants
    const baseRoute = basePath + 'diary';
    const authorizationScope = 'AS.DIARY';

    //List All
    this.get(baseRoute + '/listall', authorization(authorizationScope), (req, res) => {
        return new Promise((resolve, reject) => {
            DiaryService.listall(req.user._id)
                .then(data => resolve(res.json(Response.Success.Custom('Successfully listed all diary entries.', data))))
        })
    });

    //Create
    this.post(baseRoute, authorization(authorizationScope), ValidatorRequest.validateRequest(diarySchema), (req, res) => {
        return new Promise((resolve, reject) => {
            DiaryService.create(req.user, req.body)
                .then(data => resolve(res.json(Response.Success.Custom('Successfully added diary entry.', data))))
                .catch(error => reject(Response.Error.Custom(res, error.message)));
        })
    })

    this.get(baseRoute + '/:id', authorization('diary.get'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            DiaryService.get_by_id(id)
            .then(data => resolve(res.json(Response.Success.Custom('Successfully retrieve diary record.', data))))
            .catch(error => reject(Response.Error.Custom(res, error.message)));
        })
    })

    this.put(baseRoute, authorization('diary.update'), ValidatorRequest.validateRequest(updateDiarySchema), (req, res) => {
        return new Promise((resolve, reject) => {
            DiaryService.update(req.body, req.user)
            .then(data => resolve(res.json(Response.Success.Custom('Successfully updated diary record.', data))))
            .catch(error => reject(Response.Error.Custom(res, error.message)));
        })
    })

    this.delete(baseRoute + '/:id', authorization('diary.delete'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            DiaryService.delete(id, req.user)
            .then(data => resolve(res.json(Response.Success.Custom('Successfully deleted diary record.', data))))
            .catch(error => reject(Response.Error.Custom(res, error.message)));
        })
    })
};
