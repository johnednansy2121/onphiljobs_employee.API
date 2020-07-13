const { Schema, model } = require('mongoose')

const userProfileReviewSchema = new Schema({

    //(required) name of the skill
    reviewDescription: { type: String, maxlength: 500, require: (true, 'Review is required.') },

    //(optional) Does the recipient display this on their profile?
    isDisplayed: { type: Boolean, default: false},

    isProtected: { type: Boolean, default: false },

    sortOrder: { type: Number, default: 0 },
    //who owns this entry, who is it for, when was it created, when was it updated
    metadata: {
        owner: {type: Schema.Types.ObjectId, ref: 'user'},
        recipient: {type: Schema.Types.ObjectId, ref: 'user'},
        dateCreated: Date,
        dateUpdated: Date
    }
});

module.exports = UserProfileReviewModel = fllairdb.model('user.review', userProfileReviewSchema)

//This model works a little different.
/*
    On the 'users profile review page' we need to show a list of reviews that have been created FOR the user by other users.
    the user that received the review gets the choice to display this review on their profile or not.

    to make a review, you visit the others profile and 'write a review' which will insert the writer as the owner, and the receiver as the recipient.
    the recipient gets the ability to choose if this review is displayed on their profile publicly or not.
*/
