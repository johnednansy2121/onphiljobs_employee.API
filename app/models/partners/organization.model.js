const { Schema } = require('mongoose')

const OrganizationSchema = new Schema({
    name: {
        type: String
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'role'
        }
    ],
    scopes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'scope'
        }
    ]
})

module.exports = OrganizationModel = onphpartnersdb.model('organization', OrganizationSchema)