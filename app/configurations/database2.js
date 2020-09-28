const mongoose = require('mongoose')

module.exports = onphpartnersdb = mongoose.createConnection(process.env.MONGODB_URL_PARTNERS, { useNewUrlParser: true, useUnifiedTopology: true })
