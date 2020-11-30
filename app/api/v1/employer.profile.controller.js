const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/employer-authorization')
const ValidatorRequest = require(basedir + '/helpers/requestValidators')
const Joi = require('@hapi/joi')
const searchQueryBuilder = require('../../schemas/searchQueryBuilder')

const createProfileSchema = Joi.object({
    firstName: Joi.string().required().messages({ 'string.empty': 'First name is required.' }),
    lastName: Joi.string().required().messages({ 'string.empty': 'Last name is required.' }),
    aboutMe: Joi.string().allow("").max(1500),
    displayPicture: Joi.string().allow(""),
    videoUrl: Joi.string().allow("", null),
    jobTitle: Joi.string().allow('', null),
    location: Joi.any(),
    socialLinks: Joi.any()
})

const updateProfileSchema = Joi.object({
    _id: Joi.string().required(),
    employer: Joi.string(),
    firstName: Joi.string().required().messages({ 'string.empty': 'First name is required.' }),
    lastName: Joi.string().required().messages({ 'string.empty': 'Last name is required.' }),
    firstName: Joi.string().required().messages({ 'string.empty': 'First name is required.' }),
    lastName: Joi.string().required().messages({ 'string.empty': 'Last name is required.' }),
    aboutMe: Joi.string().allow("").max(1500),
    jobTitle: Joi.string().allow('', null),
    location: Joi.any(),
    displayPicture: Joi.string().allow(""),
    videoUrl: Joi.string().allow("", null),
    socialLinks: Joi.any(),
    metadata: Joi.any()
})

module.exports = function() {
    const baseRoute = basePath + 'employer-profile'
    const scope = 'profile'

    this.get(baseRoute, authorization(scope + '.get'), async(req, res) => {
        try {
            const result = await EmployerProfileService.getMyProfile(req.employer)
            res.status(200).json(result)
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    this.post(baseRoute, authorization(scope + '.create'), ValidatorRequest.validateRequest(createProfileSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            console.log("req.body",req.body);
            console.log("req.employer",req.employer);
            EmployerProfileService.create(req.body, req.employer)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully created profile', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.put(baseRoute, authorization(scope + '.update'), ValidatorRequest.validateRequest(updateProfileSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            EmployerProfileService.update(req.body, req.employer)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully updated profile.', response))))
                .catch(error =>{console.log(error); reject(Response.Error.Custom(res, error.message))})
        })
    })

    this.get(baseRoute + '/:name', (req, res) => {
        return new Promise((resolve, reject) => {
            const name = req.params.name
            EmployerProfileService.getProfileByEmployerName(name)
                .then(result => resolve(res.json(Response.Success.Custom(`Successfully retrieve employer profile of ${name}.`, result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.get(baseRoute + '/:name/private', async(req, res) => {
        try {
            const { code } = req.query
            const { name } = req.params
         
            const result = await EmployerProfileService.getProfileWithPrivateInfo(code, name)

            res.status(200).json(result)
            
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })
}
