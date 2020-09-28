const { Schema } = require('mongoose')

const paymentMethodSchema = Schema({
    stripeCustomerId: {
        type: String
    },
    stripePaymentMethodId: {
        type: String
    },
    last4digit: {
        type: String
    },
    cardType: {
        type: String
    },
    metadata: {
        owner: {
            type: Schema.Types.ObjectId, ref: 'user'
        },
        dateCreated: {
            type: Date
        }
    }
})

module.exports = PaymentMethodModel = onphdb.model('paymentmethod', paymentMethodSchema)