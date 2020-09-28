const { Schema, model } = require('mongoose')

const userProfileAchievementsSchema = new Schema({

    //what is the achievement (Soup Kitchen Volunteer)
    achievementName: { type: String, maxlength: 80, required: (true, 'Achievement Name is required.') },

    //what is this about 'rich text' (ie Donated time at a soup kitchen to help feed)
    achievementDescription: { type: String, maxlength: 500 },

    //when did it start
    dateStarted: { type: Date, required: (true, 'Date Started is required.') },

    isProtected: { type: Boolean, default: false },

    sortOrder: { type: Number, default: 0 },
    //when did it end
    dateFinished: { type: Date },

    //who owns this entry, when was it created, when was it updated
    metadata: {
        owner: {type: Schema.Types.ObjectId, ref: 'user'},
        dateCreated: Date,
        dateUpdated: Date
    }

})

module.exports = UserAchievementModel = onphdb.model('user.achievement', userProfileAchievementsSchema)
