const { Schema, model } = require('mongoose')

const userProfilePortfolioSchema = new Schema({

    //(required) name of the portfolio item
    itemName: { type: String, maxlength: 80 },

    //(optional) desc of the portfolio item
    itemDescription: { type: String, maxlength: 500 },

    isProtected: { type: Boolean, default: false },

    sortOrder: { type: Number, default: 0 },
    //(required) url of the image uploaded to s3 (all images can be 'unlisted' public to anyone with the url)
    itemImageUrl: { type: String },

    //(optional) array of tags "Work Showcases", "Certifications", "Hard Copy References", "Other"
    tags: [String],

    //who owns this entry, when was it created, when was it updated
    metadata: {
        owner: {type: Schema.Types.ObjectId, ref: 'user'},
        dateCreated: Date,
        dateUpdated: Date
    }
});

module.exports = UserProfilePortfolioModel = fllairdb.model('user.portfolio', userProfilePortfolioSchema)
