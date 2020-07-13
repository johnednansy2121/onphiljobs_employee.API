const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')

module.exports = function() {
    const baseRoute = basePath + 'invoices'

    this.get(baseRoute, authorization('invoice.get'), (req, res) => new Promise((resolve, reject) => {
        InvoiceService.getmyinvoices(req.user)
        .then(response => resolve(res.json(Response.Success.Custom('successfully retrieve invoices', response))))
        .catch(err => reject(Response.Error.Custom(res, err.message)))
    }))
}