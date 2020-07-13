const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')
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
    user: Joi.string(),
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
    const baseRoute = basePath + 'profile'
    const scope = 'profile'

    this.get(baseRoute, authorization(scope + '.get'), async(req, res) => {
        try {
            const result = await UserProfileService.getMyProfile(req.user)

            res.status(200).json(result)
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
        // return new Promise((resolve, reject) => {
        //     const userId = req.user._id
        //     UserProfileService.getMyProfile(userId)
        //         .then(response => resolve(res.json(Response.Success.Custom('Successfully retreive profile', response))))
        //         .catch(error => reject(Response.Error.Custom(res, error.message)))
        // })
    })

    this.post(baseRoute, authorization(scope + '.create'), ValidatorRequest.validateRequest(createProfileSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserProfileService.create(req.body, req.user)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully created profile', result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.put(baseRoute, authorization(scope + '.update'), ValidatorRequest.validateRequest(updateProfileSchema), (req, res) => {
        return new Promise((resolve, reject) => {
            UserProfileService.update(req.body, req.user)
                .then(response => resolve(res.json(Response.Success.Custom('Successfully updated profile.', response))))
                .catch(error =>{console.log(error); reject(Response.Error.Custom(res, error.message))})
        })
    })

    this.get(baseRoute + '/:name', (req, res) => {
        return new Promise((resolve, reject) => {
            const name = req.params.name
            UserProfileService.getProfileByUserName(name)
                .then(result => resolve(res.json(Response.Success.Custom(`Successfully retreive user profile of ${name}.`, result))))
                .catch(error => reject(Response.Error.Custom(res, error.message)))
        })
    })

    this.get(baseRoute + '/:name/private', async(req, res) => {
        try {
            const { code } = req.query
            const { name } = req.params
         
            const result = await UserProfileService.getProfileWithPrivateInfo(code, name)

            res.status(200).json(result)
            
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    })

    // this.get(basePath + 'talent', async(req, res) => {
    //     try {
    //         const query = searchQueryBuilder(req.query)

    //         const result = await UserProfileService.search(query)

    //         res.status(200).json(result)
    //     } catch(err) {
    //         res.status(400).json({ Message: err.message, Successful: false })
    //     }
    // })
}
