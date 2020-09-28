const { Schema, model } = require('mongoose')

const userTaskSchema = new Schema({

    //(required) name of the task
    name: { type: String, maxlength: 255, require: (true, 'Task name is required.') },

    //(optional) notes for the task
    notes: { type: String, maxlength: 500 },

    //array of tags, for filtering, search and organisation
    tags: [String],

    //(optional) Is the task completed?
    isCompleted: { type: Boolean, default: false},
    dateDue: { type: Date },
    //who owns this entry, who is it for, when was it created, when was it updated, and when was it due
    metadata: {
        owner: {type: Schema.Types.ObjectId, ref: 'user'},
        // sharedWith: [{type: Schema.Types.ObjectId, ref: 'user'}], //For later version 2
        dateCreated: Date,
        dateUpdated: Date,
    }
});

module.exports = UserTaskModel = onphdb.model('user.task', userTaskSchema)
