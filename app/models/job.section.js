const { Schema, model } = require('mongoose')

const jobSectionSchema = new Schema({
    title: string,
    description: string
})

module.exports = JobSectionModel = onphpartnersdb.model('jobs.section', jobSectionSchema);