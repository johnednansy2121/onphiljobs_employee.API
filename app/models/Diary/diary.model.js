const { Schema, model } = require('mongoose');

const diarySchema = new Schema({

    title: {
        type: String,
        required: (true, 'Diary title is required.')
    },

    body: {
        type: String,
        required: (true, 'Diary body is required.')
    },

    metadata: {
        owner: {type: Schema.Types.ObjectId, ref: 'user'},
        created: Date
    }

});

module.exports = DiaryModel = fllairdb.model('dairy', diarySchema);
