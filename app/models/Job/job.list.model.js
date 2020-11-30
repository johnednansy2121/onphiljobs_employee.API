const { Schema, model } = require('mongoose')

const jobListSchema = new Schema({
    _id: string,
    title: string,
    subtitle: string,
    status: string,
    metadata: {
        dateCreated: Date,
        dateUpdated: Date
    }
})

module.exports = JobListModel = onphpartnersdb.model('jobs.list', jobListSchema);
