const { Schema, model } = require('mongoose')

const jobEditSchema = new Schema({
    _id: string,
    title: string,
    subtitle: string,
    section: {
        ref: 'section'
    },
    details: {
        isWorkFromHome: boolean,
        location: {
            address1: string,
            address2: string,
            city: string,
            state: string,
            postalCode: string,
            country: string,
            lat: number,
            long: number,
        },
        salary: {
            base: number,
            upper: number,
            currency: string,
            type: string,
        },
        commitment: {
            type: string,
            duration: {
                quantity: number,
                unit: string
            }
        },
        category: string
    },
    status: string,
    premium: {
        isFeatured: boolean
    },
    client: string
})

module.exports = JobEditModel = onphpartnersdb.model('jobs.edit', jobEditSchema);