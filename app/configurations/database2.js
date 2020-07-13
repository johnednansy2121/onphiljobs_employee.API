const mongoose = require('mongoose')

module.exports = partnersdb = mongoose.createConnection(process.env.MONGODB_URL_PARTNERS, { useNewUrlParser: true, useUnifiedTopology: true })
