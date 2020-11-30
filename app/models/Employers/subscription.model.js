const { Schema } = require('mongoose')

const subscriptionSchema = new Schema({
    subscriptionId: {
        type: String
    },
    planId: {
        type: String
    },
    nextInterval: {
        type: Date
    },
    isCancelled: {
        type: Boolean
    },
    metadata: {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'employer'
        },
        dateCreated: {
            type: Date
        }
    }
})

module.exports = SubscriptionModel = onphpartnersdb.model('subscription', subscriptionSchema)