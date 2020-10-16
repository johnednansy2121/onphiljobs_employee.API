const { Schema, model } = require('mongoose')
const uuid = require('uuid')

const forgotPasswordSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    code: {
        type: String,
        default: uuid.v1().toUpperCase()
    },
    expiresIn: {
        type: Date,
        default: new Date(new Date().getTime() + 15 * 60000)
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    metadata: {
        dateCreated: Date
    }
})

module.exports = ForgotPasswordModel = onphpartnersdb.model('forgotpassword', forgotPasswordSchema)