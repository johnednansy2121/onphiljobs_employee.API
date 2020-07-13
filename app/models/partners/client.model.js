const { Schema } = require('mongoose')


const ClientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    metadata: {
        organization: {
            type: Schema.Types.ObjectId,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
        },
        dateCreated: {
            type: Date
        },
        dateUpdated: {
            type: Date
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
        }
    }
})

module.exports = ClientModel = partnersdb.model('client', ClientSchema)