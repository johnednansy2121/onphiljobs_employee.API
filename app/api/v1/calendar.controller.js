const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')

module.exports = function() {

    const baseRoute = basePath + 'calendar'

    this.get(baseRoute + '/my', authorization('calendar.get'), (req, res) => {
        return new Promise((resolve, reject) => {
            CalendarService.getallevents(req.user)
                .then(response => resolve(res.json(Response.Success.Custom('successfully retrieve events.', response))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.get(baseRoute + '/ical/:id', (req, res) => {
        return new Promise((resolve, reject) => {
            const id = req.params.id
            CalendarService.getalleventsics(id)
                .then(response => resolve(res.status(200).sendFile(response)))
                .catch(err => reject(res.status(400).json(err)))
        })
    })
}