const { Schema, model } = require('mongoose')

const inviteSchema = new Schema({
    applicantId: {
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    metadata: {
        organization: {
            type: String,
            ref: 'organization'
        },
        actor: {
            type: String,
            ref: 'user'
        },
        dateCreated: {
            type: Date
        },
        dateUpdated: {
            type: Date
        }
    }
})

module.exports = InviteModel = onphpartnersdb.model('application.invite', inviteSchema);

