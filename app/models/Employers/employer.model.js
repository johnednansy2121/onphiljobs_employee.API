const { Schema, model } = require('mongoose')

const employerSchema = new Schema({
    email: {
        type: String,
        required: (true, 'Email is required.'),
        unique: (true, 'Email already exists.')
    },
    employerName: {
        type: String,
        required: (true, 'User name is required.'),
        unique: (true, 'User name is already taken.')
    },
    password: {
        type: String,
        required: (true, 'Password is required.')
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        default: ''
    },
    on2FA: {
        type: Boolean,
        default: false
    },
    registrationTag: {
        type: String
    },
    metadata: {
        verificationToken: {
            type: String
        },
        hasProfile: {
            type: Boolean,
            default: false
        },
        organization: {
            type: Schema.Types.ObjectId, ref: 'organization',
        },
        dateCreated: Date,
        dateUpdated: Date
    }
})

module.exports = EmployerModel = onphpartnersdb.model('employer', employerSchema);
