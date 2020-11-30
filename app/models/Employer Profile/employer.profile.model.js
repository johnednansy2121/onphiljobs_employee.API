const { Schema, model } = require('mongoose')

const employerProfileSchema = new Schema({

    //which recruiter owns this profile
    employer: {
        type: Schema.Types.ObjectId,
        ref: 'employer',
        unique: (true, 'Employer has already a profile.')
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
    
    // premium : {
    //     hasProSubscription: {type: Boolean, default: false},        //Does this user have an active pro subscription

    //     hasInterview: {type: Boolean, default: false},              //Has the user been interviewed by our consultants
    //     interviewDate: {type: Date},                                //When was the interview conducted

    //     isProfileVerified: {type: Boolean, default: false},         //(Unused) Have our consultants verified the claims this user makes
    //     hasProofOfWorkingRights: {type: Boolean, default: false},   //(Unused) Has this user got proof of working rights (verified passport, verified drivers licence etc)
    //     subscription: { type: Schema.Types.ObjectId, ref: 'subscription' }
    // },

    //Recruiter Metadata
    metadata: {
        dateCreated: {type: Date},
        dateUpdated: {type: Date}
    }
})

module.exports = EmployerProfileModel = onphpartnersdb.model('employer.profiles', employerProfileSchema)
