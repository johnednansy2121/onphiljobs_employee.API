const ics = require('ics')
const { endOfDay, format, startOfDay } = require('date-fns')
const { writeFileSync } = require('fs')

module.exports = CalendarService = {
    addEvent: (event) => {
        const { eventTitle, referenceId, eventType, dateStart, dateEnd, owner } = event
        CalendarModel.create({
            eventTitle,
            eventType,
            referenceId,
            dateStart,
            dateEnd,
            metadata: {
                owner
            }
        })
    },
    delete: (referenceId) => {
        if(referenceId != null && referenceId != '') {
            CalendarModel.findOne({ referenceId: referenceId })
            .then(calendar => {
                if(calendar) {
                    CalendarModel.remove(calendar)
                    .then(res => console.log('deleted'))
                }
            })
        }
        
    },
    getallevents: (user) => {
        return new Promise((resolve, reject) => {
            CalendarModel.find({ 'metadata.owner': user._id, dateStart:  { $gte: new Date(new Date().setDate(new Date().getDate() - 30)), $lte: new Date(new Date().setDate(new Date().getDate() + 30))} } )
                .then(events => resolve(events))
                .catch(err => reject({ message: err.message }))
        })
    },
    getalleventsics: (id) => {
        return new Promise((resolve, reject) => {
            CalendarModel.find({ 'metadata.owner': id, dateStart:  { $gte: new Date(new Date().setDate(new Date().getDate() - 30)), $lte: new Date(new Date().setDate(new Date().getDate() + 30))} } )
                .then(events => {
                    let calendarEvents = events.map(event => {
                        return {
                            start: event.dateEnd ?  format(new Date(event.dateStart), "yyyy-M-d-H-m").split('-') : format(startOfDay(new Date(event.dateStart)), "yyyy-M-d-H-m").split('-'),
                            title: event.eventTitle,
                            end: event.dateEnd ? format(new Date(event.dateEnd), "yyyy-M-d-H-m").split('-') : format(endOfDay(new Date(event.dateStart)), "yyyy-M-d-H-m").split('-')
                        }
                    })

                    const { error, value} = ics.createEvents(calendarEvents)

                    if(error) {
                        console.log(error)
                        reject(error)
                    }
                    writeFileSync(basedir + `/calendars/event-${id}.ics`, value)
                    resolve(basedir + `/calendars/event-${id}.ics`)

                })
                .catch(err => reject({ message: err.message }))
        })
    }
}