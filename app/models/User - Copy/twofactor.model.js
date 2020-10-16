const { Schema } = require('mongoose')


const twoFactorSchema = new Schema({
    number: {
        type: String
    },
    code: {
        type: String
    },
    secret: {
        type: String
    },
    metadata: {
        dateCreated: {
            type: Date
        }
    }
})

module.exports = twoFactorModel = onphdb.model('twoFactor', twoFactorSchema)