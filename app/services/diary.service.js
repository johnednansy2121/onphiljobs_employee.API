const Metadata = require(basedir + '/helpers/metadata.js');

module.exports = DiaryService = {

    create: (owner, insertObject) => {
        return new Promise((resolve, reject) => {
            // resolve(samples)
            let diaryEntry = insertObject;
            insertObject.metadata = Metadata.generateWithOwner(owner);

            DiaryModel.create(diaryEntry)
                .then(result => resolve(result))
                .catch(error => reject(error))
        })
    },

    listall: (owner) => {
        return new Promise((resolve, reject) => {
            DiaryModel.find({"metadata.owner": owner})
                .then( data => {
                    if (!data) reject("No diary entries returned.");
                    resolve(data)
                })
                .catch(error => reject(error))
        })
    },
    get_by_id: (id) => {
        return new Promise((resolve, reject) => {
            DiaryModel.findById(id)
                .then(diary => resolve(diary))
                .catch(err => reject({ message: err.message }))
        })
    },
    update: (data, user) => {
        return new Promise((resolve, reject) => {
            const { _id, title, body } = data
            DiaryModel.findOne({ _id: _id, 'metadata.owner': user._id })
            .then(diary => {
                if(!diary) reject({ message: 'You are not allowed to edit this diary record.'})
                else {
                    DiaryModel.update({ _id: _id }, {
                        $set: {
                            title,
                            body
                        }
                    })
                    .then(updateRes => resolve({ _id, title, body, metadata: { ...diary.metadata } }))
                    .catch(err => reject({ message: err.message }))
                }
            })
            .catch(err => reject({ message: err.message }))
        })
    },
    delete: (id, user) => {
        return new Promise((resolve, reject) => {
            DiaryModel.findOne({ _id: id, 'metadata.owner': user._id })
            .then(diary => {
                if(!diary) reject({ message: 'You are not allowed to delete this diary record.'})
                else {
                    DiaryModel.remove(diary)
                    .then(_ => resolve(true))
                    .catch(err => reject({ message: err.message }))
                }
            })
            .catch(err => reject({ message: err.message }))
        })
    }
};
