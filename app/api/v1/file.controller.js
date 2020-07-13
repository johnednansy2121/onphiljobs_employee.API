const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')

module.exports = function() {
    const baseRoute = basePath + 'files'

    this.post(baseRoute + '/displayPhoto', (req, res) => {
        return new Promise((resolve, reject) => {
            const data = req.files.displayPhoto
            FileService.uploadPhoto(data)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully uploaded display photo', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.post(baseRoute + '/image', (req, res) => {
        return new Promise((resolve, reject) => {
            const data = req.files.image
            FileService.uploadPhoto(data)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully uploaded display photo', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })
}