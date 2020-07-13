const userAPI = require('./user.api.json');
const sampleAPI = require('./sample.api.json');
const forgotPasswordAPI = require('./forgot.password.api.json');
const diaryAPI = require('./diary.api.json');
const profileAPI = require('./user.profile.api.json');
const wordpressAPI = require('./wordpress.api');
const fileAPI = require('./file.api')
const educationAPI = require('./user.education.api')
const skillAPI = require('./user.skill.api')
const workExperienceAPI = require('./user.experience.api')
const achievementAPI = require('./user.achievement.api')
const portfolioAPI = require('./user.portfolio.api')
const reviewAPI = require('./user.review.api')
const taskAPI = require('./task.api')
const calendarAPI = require('./calendar.api')
const planAPI = require('./plan.api')
const paymentMethodAPI = require('./paymentmethod.api')
const subscriptionAPI = require('./subscription.api')
const invoiceAPI = require('./invoice.api.json')
const twoFactorAuthenticationAPI = require('./2fa.api.json')
const jobAPI = require('./job.api.json')
const applicationAPI = require('./application.api.json')

const routes = {
    ...userAPI.routes,
    ...sampleAPI.routes,
    ...forgotPasswordAPI.routes,
    ...diaryAPI.routes,
    ...profileAPI.routes,
    ...wordpressAPI.routes,
    ...fileAPI.routes,
    ...educationAPI.routes,
    ...skillAPI.routes,
    ...workExperienceAPI.routes,
    ...achievementAPI.routes,
    ...portfolioAPI.routes,
    ...reviewAPI.routes,
    ...taskAPI.routes,
    ...calendarAPI.routes,
    ...planAPI.routes,
    ...paymentMethodAPI.routes,
    ...subscriptionAPI.routes,
    ...invoiceAPI.routes,
    ...twoFactorAuthenticationAPI.routes,
    ...jobAPI.routes,
    ...applicationAPI.routes
}
const models = {
    ...userAPI.models,
    ...sampleAPI.models,
    ...forgotPasswordAPI.models,
    ...diaryAPI.models,
    ...profileAPI.models,
    ...wordpressAPI.models,
    ...educationAPI.models,
    ...skillAPI.models,
    ...workExperienceAPI.models,
    ...achievementAPI.models,
    ...portfolioAPI.models,
    ...reviewAPI.models,
    ...taskAPI.models,
    ...calendarAPI.models,
    ...paymentMethodAPI.models,
    ...subscriptionAPI.models,
    ...invoiceAPI.models,
    ...jobAPI.models
}

module.exports = {
    swagger: "2.0",
    info: {
        title: "FLLAIR api management",
        version: "1.0.0",
        description: "API documentation management."
    },
    basePath: "/api/v1",
    tags: [
        {
            name: 'user',
            description: 'user management'
        },
        {
            name: 'sample',
            description: 'sample only for authorization.'
        },
        {
            name: 'forgot password',
            description: 'forgot password api management.'
        }
    ],
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    paths: routes,
    definitions: models,
    components: {
        baseResult: {
            type: 'object',
            properties: {
                message: {
                    type: 'string'
                },
                successful: {
                    type: 'boolean'
                }
            }
        },
        UNAUTHORIZED: {
            description: "unauthorized access",
            schema: {
                properties: {
                    message: {
                        type: 'string'
                    }
                }
            }
        },
        BAD_REQUEST: {
            description: 'bad request',
            schema: {
                $ref: '#/components/baseResult'
            }
        }
    },
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            in: 'header'
        }
    }
}
