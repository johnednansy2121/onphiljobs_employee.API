const twoFactor = require('node-2fa')
const AWS = require('aws-sdk')


AWS.config.update({
    accessKeyId: Configuration.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: Configuration.AWS_SES_SECRET_ACCESS_KEY,
    region: Configuration.AWS_SES_REGION
})

const sns = new AWS.SNS({ apiVersion: '2010-03-31'})


module.exports = twoFAService = {
    generateCode: async(number) => {
        try {
            const { secret } = twoFactor.generateSecret({ app: 'FLLAIR APP' })
            const { token } = twoFactor.generateToken(secret)

            await twoFactorModel.create({
                secret,
                code: token,
                number,
                metadata: {
                    dateCreated: new Date()
                }
            })
            const result = await sns.publish({
                Message: 'FLLAIR PHONE VERIFICATION CODE:' + token,
                Subject: 'PHONE VERIFICATION',
                PhoneNumber: number
            }).promise()
            console.log(result)
            return true

        } catch(err) {
            throw new Error(err.message)
        }
    },
    verifyCode: async(number, code) => {
        try {

            const searchResult = await twoFactorModel.find({ code, number }).sort({ 'metadata.dateCreated' : -1 })
            if(searchResult.length <= 0) throw new Error('number and code does not match.')
            const resultItem = searchResult[0]
            const result = twoFactor.verifyToken(resultItem.secret, code, 10)
            if(!result) throw new Error('Invalid code.')
            const { delta } = result
            if(delta === -1) throw new Error('Code is expired.')
            else if(delta === 1) throw new Error('Invalid code.')
            return true
            
        } catch(err) {
            throw new Error(err.message)
        }
    },
    generate2FACode: async(number, email) => {
        try {
            const { secret } = twoFactor.generateSecret({ app: 'FLLAIR APP' })
            const { token } = twoFactor.generateToken(secret)

            await twoFactorModel.create({
                secret,
                code: token,
                number: email,
                metadata: {
                    dateCreated: new Date()
                }
            })
            
            const result = await sns.publish({
                Message: 'FLLAIR 2 FACTOR AUTHENTICATION CODE:' + token,
                Subject: '2 FACTOR AUTHENTICATION',
                PhoneNumber: number
            }).promise()
            console.log(result)
            return true

        } catch(err) {
            throw new Error(err.message)
        }
    }
}