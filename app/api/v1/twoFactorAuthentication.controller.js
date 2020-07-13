const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')


module.exports = function() {
    const baseRoute = basePath + 'two-factor'


    this.get(baseRoute + '/request/:number', async(req, res) => {
        try {
            const { number } = req.params

            const result = await twoFAService.generateCode(number)

            res.status(200).json({ model: result, successful: true, message: 'Successfully send phone verification.' })
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.get(baseRoute + '/:number/verify/:code', async(req, res) => {
        try {
            const { code, number } = req.params

            const result = await twoFAService.verifyCode(number, code)

            res.status(200).json({ model: result, successful: true, message: 'Successfully verified phone number.'})
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })
}