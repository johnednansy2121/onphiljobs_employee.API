const { Schema, model } = require('mongoose')

const companySchema = new Schema({
    email: {
        type: String,
        required: (true, 'Email is required.'),
        unique: (true, 'Email already exists.')
    },
    companyName: {
        type: String,
        required: (true, 'Company name is required.')
    },
    description: {
        type: String,
        required: (true, 'Company description is required.')
    },
    location: {
        type: String,
        required: (true, 'Company location is required.')
    },
    companySize: {
        type: String,
        required: (true, 'Company size is required.')
    },
    dressCode: {
        type: String,
        required: (true, 'Company size is required.')
    },
    benefits: {
        type: String,
        required: (true, 'Company size is required.')
    },
    workHours: {
        type: String,
        required: (true, 'Company size is required.')
    },
    spokenLanguage: {
        type: String,
        required: (true, 'Company size is required.')
    }
})

module.exports = CompanyModel = onphpartnersdb.model('company', companySchema);
