const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const searchQueryBuilder = require('../../schemas/searchQueryBuilder')

module.exports = function() {

    const baseRoute = basePath + 'application'

    this.get(baseRoute , authorization('application.get'), async(req, res) => {
        try {
            const result = await ApplicationService.search(searchQueryBuilder(req.query),req.user)

            res.status(200).json(result)
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.put(baseRoute + '/:id/withdraw', async(req, res) => {
        try {
            const { id } = req.params

            const result = await ApplicationService.withdraw(id, req.user)

            res.status(200).json({ message: 'successfully withdrawn application', successful: true, model: result })
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })
}