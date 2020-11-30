const { Schema, model } = require('mongoose')

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    scopes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'scope'
        }
    ],
    metadata: {
        dateCreated: {
            type: Date
        },
        dateUpdated: {
            type: Date
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    }
})

module.exports = RoleModel = onphpartnersdb.model('roles', roleSchema)
