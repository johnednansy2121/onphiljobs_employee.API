const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')

module.exports = function() {
    const baseRoute = basePath + 'sample'
    const authorizationScope = 'AS.SAMPLE';

    this.get(baseRoute, authorization(authorizationScope), (req, res) => {
        return new Promise((resolve, reject) => {
            SampleService.get()
                .then(data => resolve(res.json(Response.Success.Custom('Successfully retrieve samples.', data))))
        })
    })

    this.post(baseRoute, authorization(authorizationScope), (req, res) => {
        return new Promise((resolve, reject) => {
            SampleService.add(req.body)
                .then(data => resolve(res.json(Response.Success.Custom('Successfully added sample.', data))))
        })
    })
}
