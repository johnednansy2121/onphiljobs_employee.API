const { Schema, model } = require('mongoose')

const userProfileEducationSchema = new Schema({

    //name of the school, uni, college
    institutionName: { type: String, maxlength: 80, required: (true, 'Institution Name is required.')  },

    //why did you attend this institution (Diploma of software engineering)
    institutionReason: { type: String, maxlength: 120 },

    isProtected: { type: Boolean, default: false },

    sortOrder: { type: Number, default: 0 },
    //date attendance started
    dateStarted: { type: Date, required: (true, 'Date Started is required.') },

    //date attendance finished
    dateFinished: { type: Date },

    //notes about your experience at this 'institution'
    notes: { type: String, maxlength: 500 },

    //who owns this entry, when was it created, when was it updated
    metadata: {
        owner: {type: Schema.Types.ObjectId, ref: 'user'},
        dateCreated: Date,
        dateUpdated: Date
    }

})

module.exports = UserEducationModel = onphdb.model('user.education', userProfileEducationSchema)
