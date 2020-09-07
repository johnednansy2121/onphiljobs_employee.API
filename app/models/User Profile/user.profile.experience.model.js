const { Schema, model } = require('mongoose')

const userProfileExperienceSchema = new Schema({

    //name of the company, org (Optimum Consulting)
    organizationName: { type: String, maxlength: 80, required: (true, 'Organization Name is required.') },

    //what is the title of your position (ie Software Engineer)
    jobTitle: { type: String, maxlength: 80, required: (true, 'Job title is required.') },
    
    isProtected: { type: Boolean, default: false },

    //what did you do in your job 'rich text' (ie A long paragraph about how i developed software)
    jobDescription: { type: String, maxlength: 500 },
    location: { type: String, default: '' },

    sortOrder: { type: Number, default: 0 }, 
    //date employment started
    dateStarted: { type: Date, required: (true, 'Date Started is required.') },

    //date employment finished
    dateFinished: { type: Date, },

    //who owns this entry, when was it created, when was it updated
    metadata: {
        owner: {type: Schema.Types.ObjectId, ref: 'user'},
        dateCreated: Date,
        dateUpdated: Date
    }

})

module.exports = UserProfileExperienceModel = onphdb.model('user.experience', userProfileExperienceSchema)
