const { basePath } = require('./apiConfig')
const authorization = require('../../helpers/authorization')
const searchQueryBuilder = require('../../schemas/searchQueryBuilder')

module.exports = function() {
    const baseRoute = basePath + 'jobs'

    this.get(baseRoute, async(req, res) => {
        try {
            const searchRequest = searchQueryBuilder(req.query)
            
            const result = await JobService.search(searchRequest, { lat: req.query.lat, long: req.query.long, distance: req.query.distance })

            res.status(200).json(result)
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.get(baseRoute + '/:id', async(req, res) => {
        try {
            const { id } = req.params

            const result = await JobService.getById(id)

            res.status(200).json(result)
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.post(baseRoute + '/:jobId/apply', authorization('Job.Apply'), async(req, res) => {
        try {
            const { _id } = req.user

            const { jobId } = req.params

            const result = await JobService.apply(jobId, _id)


            res.status(200).json({ message: 'Successfully applied for the job.', successful: true, model: true })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })
}