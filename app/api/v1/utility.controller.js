const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')

module.exports = function() {
    const baseRoute = basePath + 'utility'

    this.get(baseRoute + '/countries', (req, res) => new Promise((resolve, reject) => {
        UtilityService.getCountries()
            .then(result => resolve(res.json(Response.Success.Custom('successfully get countries', result))))
    }))
}