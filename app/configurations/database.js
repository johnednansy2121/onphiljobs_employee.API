const mongoose = require('mongoose')

module.exports = fllairdb = mongoose.createConnection(Configuration.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
