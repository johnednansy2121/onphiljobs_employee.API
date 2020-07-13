const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const createTaskSchema = Joi.object({
    name: Joi.string().required().messages({ 'string.empty': 'Task name is required.', 'string.required': 'Task name is required.'}).max(80),
    notes: Joi.string().allow('', null).max(500),
    tags: Joi.array().allow(null),
    dueDate: Joi.string().allow('', null)
})

const updateTaskSchema = Joi.object({
    _id: Joi.string().required().messages({ 'string.empty': '_id is required.', 'string.required': '_id is required.'}),
    name: Joi.string().required().messages({ 'string.empty': 'Task name is required.', 'string.required': 'Task name is required.'}).max(80),
    notes: Joi.string().allow('', null).max(500),
    tags: Joi.array().allow(null),
    dueDate: Joi.string().allow('', null),
    isCompleted: Joi.boolean().default(false)
})

module.exports = function() {
    const baseRoute = basePath + 'tasks'

    this.post(baseRoute, authorization('tasks.create'), ValidatorRequest.validateRequest(createTaskSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            TaskService.create(req.body, req.user)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully created task', response))))
                .catch(error => reject(Response.Error.Custom(res, error.message )))
        })
    })

    this.get(baseRoute + '/:id', (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            TaskService.getbyid(id)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully retrieve task record.', response))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.get(baseRoute, authorization('tasks.search'), (req, res) => {
        return new Promise((resolve, reject) => {
            const tags = req.query.tags ? req.query.tags.split(',') : []
            const sort = req.query.sort
            TaskService.searchmytask(tags, sort, req.user)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully retrieve task records.', response))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.put(baseRoute, authorization('tasks.update'), ValidatorRequest.validateRequest(updateTaskSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            TaskService.update(req.body, req.user)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully update task record.', response))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.delete(baseRoute + '/:id', authorization('tasks.delete'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            TaskService.delete(id, req.user)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully deleted task record.', response))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.get(baseRoute + '/markAsCompleteIncomplete/:id', authorization('tasks.update'), (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            TaskService.markAsCompleteIncomplete(id, req.user)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully mark complete/incomplete task record.', response))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })
}