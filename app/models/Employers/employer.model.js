const { Schema, model } = require('mongoose')

const employerSchema = new Schema({
    email: {
        type: String,
        required: (true, 'Email is required.'),
        unique: (true, 'Email already exists.')
    },
    userName: {
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
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'organization'
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'role'
        }
    ],
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
        dateCreated: Date,
        dateUpdated: Date
    }
})

module.exports = EmployerModel = onphpartnersdb.model('employer', employerSchema);
