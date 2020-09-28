const { Schema } = require('mongoose')

const calendarSchema = new Schema({
    referenceId: {
        type: Schema.Types.ObjectId
    },
    eventType: {
        type: String
    },
    dateStart: {
        type: Date
    },
    dateEnd: {
        type: Date
    },
    eventTitle: {
        type: String
    },
    metadata: {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    }
})

module.exports = CalendarModel = onphdb.model('calendar', calendarSchema)