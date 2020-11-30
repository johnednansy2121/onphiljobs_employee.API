const { Schema, model } = require('mongoose')

const clientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    metadata: {
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'organization'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        dateCreated: {
            type: Date
        },
        dateUpdated: {
            type: Date
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    },

})

module.exports = ClientModel = onphpartnersdb.model('client', clientSchema);
