const { Schema } = require('mongoose')


const ApplicationSchema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'job'
    },
    status: {
        type: String,
        default: 'SUBMITTED'
    },
    metadata: {
        updateBy: {
            type: Schema.Types.ObjectId
        },
        dateCreated: {
            type: Date
        },
        dateUpdated: {
            type: Date
        }
    }
})

module.exports = ApplicationModel = onphpartnersdb.model('application', ApplicationSchema)