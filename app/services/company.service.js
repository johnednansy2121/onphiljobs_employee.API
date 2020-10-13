const bcrypt = require('bcryptjs')
const regex = require(basedir + '/helpers/regex')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const twoFactor = require('node-2fa')


module.exports = CompanyService = {
    // create: (data) => {
    //     return new Promise((resolve, reject) => {
    //         const { email, description, location, companySize, dressCode, benefits, spokenLanguage, workHours, companyName } = data
    //         if(!regex.email.test(email)) reject({ message: 'Email is not valid' })
           
    //         encrypt
    //             .then(encryptedPassword => { return UserModel.create({ email: email.toLowerCase(), userName: userName.toLowerCase(), password: encryptedPassword, registrationTag: tag, phone, on2FA, metadata: { verificationToken: uuid.v4(), dateCreated: new Date() } })})
    //             .then(data =>{

    //                 EmailHelper.sendEmail('email.verification.template', { link: Configuration.CLIENT_URL + `/auth/verify/${data.metadata.verificationToken}`},{
    //                     to: data.email,
    //                     subject: 'Email Verification'
    //                 });

    //                 resolve("You have successfully signed up. Please verify your email.")
    //             })
    //             .catch(error => { reject({ message: error.message}) })

    //     })
    // },
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            UserModel.findById(id)
                .then(user => {
                    if(!user) reject({ message: 'user not found.'})
                    resolve(user)
                })
                .catch(error => reject({ message: error.message }))
        })
    }
}
