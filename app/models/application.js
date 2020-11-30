const { Schema, model } = require('mongoose')


const applicationSchema = new Schema({
    job: {
        type: Schema.Types.ObjectId,
        ref: 'job'
    },
    applicant: {
        type: Schema.Types.ObjectId
    },
    status: {
        type: String
    },
    metadata: {
        dateCreated: {
            type: Date
        },
        dateUpdated: {
            type: Date
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: 'user'
        }
    }
})

module.exports = ApplicationModel = onphpartnersdb.model('application', applicationSchema);