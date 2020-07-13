const fileUploader = require(basedir + '/helpers/s3uploader')

module.exports = FileService = {
    uploadPhoto: (file) => {
        return new Promise((resolve, reject) => {
            fileUploader.uploadPhoto(file)
                .then(url => resolve(url))
                .catch(error => reject({ message: error.message }))
        })
    },
    uploadImage: (file) => {
        return new Promise((resolve, reject) => {
            fileUploader.uploadImage(file)
                .then(url => resolve(url))
                .catch(error => reject({ message: error.message }))
        })
    }
}