const { Schema, model } = require('mongoose')

const ScopeSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = ScopeModel = onphpartnersdb.model('scopes', scopeSchema)
