const mongoose = require('mongoose')

module.exports = onphdb = mongoose.createConnection(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

