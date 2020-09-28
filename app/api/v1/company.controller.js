const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')

const companySchema = Joi.object({
    email: Joi.string().email().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    companySize: Joi.string().required(),
    dressCode: Joi.string().required(),
    benefits: Joi.string().required(),
    workHours: Joi.string().required(),
    spokenLanguage: Joi.string().required(),
    companyName: Joi.string().required().messages({ 'string.empty': 'company name is required.' })
})

module.exports = function(){
    const baseRoute = basePath + 'company'

    this.post(baseRoute + '/create-company', ValidatorRequest.validateRequest(companySchema), (req, res) => {
        return new Promise((resolve, reject) => {
            console.log(req.body)
            const tag  = req.query.tag ? req.query.tag : ''
            CompanyService.create({ ...req.body, tag })
                .then(data => resolve(
                    res.json(Response.Success.Custom('successfully created the company.', data
                    ))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })
}
