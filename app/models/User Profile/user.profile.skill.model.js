const { Schema, model } = require('mongoose')

const userProfileSkillSchema = new Schema({

    //(required) name of the skill
    skillName: { type: String, maxlength: 80, require: (true, 'Skill Name is required.') },

    //(required) how good are you at it [beginner, average, intermediate, expert, instructor]
    skillLevel: {
        type: Number,
        min: 1,
        max : 5,
        default: 3
    },
    sortOrder: { type: Number, default: 0 },

    isProtected: { type: Boolean, default: false },
    
    //(required) how many years of experience do you have with this skill
    yearsOfExperience: { type: Number, default: 0 },

    //(optional) notes
    notes: { type: String, maxlength: 500 },

    //who owns this entry, when was it created, when was it updated
    metadata: {
        owner: {type: Schema.Types.ObjectId, ref: 'user'},
        dateCreated: Date,
        dateUpdated: Date
    }
});

module.exports = UserProfileSkillModel = fllairdb.model('user.skill', userProfileSkillSchema)
