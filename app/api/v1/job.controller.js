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

    routes.post(baseRoute,authorization('Job.Create'), async(req, res) => {
        try {
            const result = await JobService.create(req.body, req.user)
    
            res.status(200).json("Successfully created job", result)
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

    this.put(baseRoute + '/:id/publish', authorization('Job.Create'), async(req, res) => {
        try {
            const { id } = req.params
    
            const result = await JobService.publish(id, req.user)
    
            res.status(200).json({ message: 'Successfully published the job.', successful: true, model: true })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.put(baseRoute + '/:id/draft', authorization('Job.Create'), async(req, res) => {
        try {
            const { id } = req.params
    
            const result = await JobService.draft(id, req.user)
    
            res.status(200).json({ message: 'Successfully drafted the job.', successful: true, model: true })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })
    
    this.put(baseRoute + '/:id/unlist', authorization('Job.Create'), async(req, res) => {
        try {
            const { id } = req.params
    
            const result = await JobService.unlist(id, req.user)
    
            res.status(200).json({ message: 'Successfully unlisted the job.', successful: true, model: true })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.put(baseRoute, authorization('Job.Create'), async(req, res) => {
        try {
            const result = await JobService.edit(req.body, req.user)
    
            res.status(200).json({ message: 'Successfully updated the job.', successful: true, model: true })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.get(baseRoute + '/:id/applicant/all', authorization('Job.Search'), async(req, res) => {
        try {
            const { id } = req.params
        
            const result = await ApplicationService.SearchByStatus(id, 'all', req.user)

            res.status(200).json({ message: 'Success.', successful: true, result: result })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.get(baseRoute + '/:id/applicant/declined', authorization('Job.Search'), async(req, res) => {
        try {
            const { id } = req.params
            
            const result = await ApplicationService.SearchByStatus(id, 'declined', req.user)
    
            res.status(200).json({ message: 'Success.', successful: true, result: result })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.get(baseRoute + '/:id/applicant/withdrawn', authorization('Job.Search'), async(req, res) => {
        try {
            const { id } = req.params
            
            const result = await ApplicationService.SearchByStatus(id, 'withdrawn', req.user)
    
            res.status(200).json({ message: 'Success.', successful: true, result: result })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.get(baseRoute + '/:id/applicant/considering', authorization('Job.Search'), async(req, res) => {
        try {
            const { id } = req.params
            
            const result = await ApplicationService.SearchByStatus(id, 'considering', req.user)
    
            res.status(200).json({ message: 'Success.', successful: true, result: result })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.get(baseRoute + '/:id/applicant/shortlist', authorization('Job.Search'), async(req, res) => {
        try {
            const { id } = req.params
            
            const result = await ApplicationService.SearchByStatus(id, 'shortlist', req.user)
    
            res.status(200).json({ message: 'Success.', successful: true, result: result })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.post(baseRoute + '/:id/invites', authorization('Job.Search'), async(req, res) => {
        try {
            const result = await JobInviteService.Invite(req.body, req.user)
    
            res.status(200).json({ message: 'Success.', successful: true, result: result })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.get('/:id/invites', authorization('Job.Search'), async(req, res) => {
        try {
            const result = await JobInviteService.SearchByJob(req.params.id, req.user)
    
            res.status(200).json({ message: 'Success.', successful: true, result: result })

        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })
}
