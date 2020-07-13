const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')

module.exports = function() {
    const baseRoute = basePath + 'plan'

    this.get(baseRoute, authorization('plan.search'), (req, res) => {
        return new Promise((resolve, reject) => {
            PlanService.getall()
            .then(response => resolve(res.json(Response.Success.Custom('successfully retrieve plans', response))))
            .catch(err => reject(Response.Error.Custom(res, err.message)))
        })
    })
}