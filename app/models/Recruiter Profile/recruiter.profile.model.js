const { Schema, model } = require('mongoose')

const recruiterProfileSchema = new Schema({

    //which recruiter owns this profile
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'recruiter',
        unique: (true, 'Recruiter has already a profile.')
    },

    jobTitle: { type: String, default: '' },
    location: { 
        state: { type: String, default: '' },
        country: { type: String, default: '' }
     },
    //recruiter details
    firstName: { type: String, maxlength: 80, required: (true, 'First Name is required.') },
    lastName: { type: String, maxlength: 80, required: (true, 'Last Name is required.') },
    middleName: { type: String, maxlength: 80 },

    //avatar
    displayPicture: { type: String },

    //Recruiter BIO
    aboutMe: { type: String, maxlength: 1500},
    //Video About Me
    videoUrl: { type: String, maxlength: 255 },

    //Social Links
    socialLinks: {
        facebook : { type: String, maxlength: 255 },
        instagram : { type: String, maxlength: 255},
        twitter : { type: String, maxlength: 255 },
        linkedin : { type: String, maxlength: 255 }
    },

    privateCode: {
        type: String
    },
    //Verification Status
    premium : {
        interviewDate: {type: Date},                                //When was the interview conducted

        isProfileVerified: {type: Boolean, default: false},         //(Unused) Have our consultants verified the claims this recruiter makes
    },

    //Recruiter Metadata
    metadata: {
        dateCreated: {type: Date},
        dateUpdated: {type: Date}
    }
})

module.exports = RecruiterProfileModel = onphpartnersdb.model('recruiter.profile', recruiterProfileSchema)
