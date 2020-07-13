const AWS = require('aws-sdk')
const { Buffer } = require('buffer')

AWS.config.update({
    accessKeyId: Configuration.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: Configuration.AWS_SES_SECRET_ACCESS_KEY,
    region: Configuration.AWS_SES_REGION
})

const s3 = new AWS.S3()

module.exports = {
    uploadPhoto: (file) => {
        return new Promise((resolve, reject) => {
            const fileName = `displayPhoto_${new Date().getTime()}.png`
            let params = {
                Bucket: Configuration.BUCKET_NAME,
                Key: fileName,
                Body: file.data,
                ACL: 'public-read'
            }
            s3.upload(params, (err, data) => {
                if (err) reject({ message: err.message })
                else
                    resolve(`https://${Configuration.BUCKET_NAME}.s3.amazonaws.com/${fileName}`)
            })
        })
    },
    uploadImage: (file) => {
        return new Promise((resolve, reject) => {
            console.log(file)
            const fileName = `image_${new Date().getTime()}.png`
            let params = {
                Bucket: Configuration.BUCKET_NAME,
                Key: fileName,
                Body: file.data,
                ACL: 'public-read'
            }
            s3.upload(params, (err, data) => {
                if (err) reject({ message: err.message })
                else
                    resolve(`https://${Configuration.BUCKET_NAME}.s3.amazonaws.com/${fileName}`)
            })
        })
    }
}