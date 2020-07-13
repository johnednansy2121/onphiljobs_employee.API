const bcrypt = require('bcryptjs')
const regex = require(basedir + '/helpers/regex')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const twoFactor = require('node-2fa')

encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10)
            .then(salt => { return bcrypt.hash(password, salt) })
            .then(encrypted => resolve(encrypted))
    })
}

comparePassword = (password, user) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password)
            .then(res => {
                if(res)
                    resolve(user)
                else
                    reject({ message: 'invalid credentials'})
            }).catch(err => {
                reject(err)
            })
    })
}

generateToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ email: user.email }, Configuration.JWT_KEY, { expiresIn: '1d' }, (error, token) => {
            if(error)
                reject(error)
            resolve(token)
        })
    })
}

verifyUser = (user) => {
    return new Promise((resolve, reject) => {
        UserModel.updateOne({ _id: user._id }, {
            $set: {
                isVerified: true,
                metadata: {
                    ...user.metadata,
                    dateUpdated: new Date()
                }
            }
        })
        .then(result => resolve(user))
        .catch(error => reject({ message: error.message }))
    })
}



module.exports = UserService = {
    signup: (data) => {
        return new Promise((resolve, reject) => {
            const { email, password, confirmPassword, userName, tag, phone, on2FA } = data
            if(on2FA) {
                if(phone === '' || phone === undefined) reject({ message: 'If 2-FA is on, mobile number is required.' })
            }

            if(userName.includes(' ')) reject({ message: 'user name must not have whitespace.'})
            if(!regex.email.test(email)) reject({ message: 'Email is not valid' })
            if(password != confirmPassword)
                reject(`Password and Confirm Password doesn't match.`)

            encryptPassword(password)
                .then(encryptedPassword => { return UserModel.create({ email: email.toLowerCase(), userName: userName.toLowerCase(), password: encryptedPassword, registrationTag: tag, phone, on2FA, metadata: { verificationToken: uuid.v4(), dateCreated: new Date() } })})
                .then(data =>{

                    EmailHelper.sendEmail('email.verification.template', { link: Configuration.CLIENT_URL + `/auth/verify/${data.metadata.verificationToken}`},{
                        to: data.email,
                        subject: 'Email Verification'
                    });

                    resolve("You have successfully signed up. Please verify your email.")
                })
                .catch(error => { reject({ message: error.message}) })

        })
    },
    login: (data) => {
        return new Promise((resolve, reject) => {
            try {
                const { userName, password } = data
                let userDetails
                UserModel.findOne({ $or: [{ email: userName.toLowerCase() }, { userName: userName.toLowerCase() }]})
                    .then(data => {
                        userDetails = data
                        if (!data) reject({ message: 'invalid credentials'})
                        if (!data.isVerified) reject({ message: 'email is not verified.'})
                        return comparePassword(password, data)
                    })
                    .then(user => { 
                        if(userDetails.on2FA) {
                            twoFAService.generate2FACode(userDetails.phone, userDetails.email).then(() => {
                                resolve({ on2FA : true })
                            })
                        } else
                            return generateToken(user) 
                    })
                    .then(token => {
                        if(userDetails.on2FA) {
                            resolve({ on2FA : true })
                        } else
                            resolve({on2FA: false, token})
                    })
                    .catch(error => reject(error))
            }
            catch(err) {
                reject(err)
            }
        })
    },
    verify: (code) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'metadata.verificationToken': code })
                .then(user => {
                    if(!user) reject({ message: 'code is invalid.'})
                    return verifyUser(user)
                })
                .then(user => {
                    return generateToken(user)
                })
                .then(token => {
                    resolve(token)
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            UserModel.findById(id)
                .then(user => {
                    if(!user) reject({ message: 'user not found.'})
                    resolve(user)
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    twoFALogin: async({ userName, code}) => {
        try {
            const searchVerificationCodeResult = await twoFactorModel.find({ number: userName, code }).sort({ 'metadata.dateCreated': -1 })

            if(searchVerificationCodeResult.length <= 0) throw new Error('Invalid code.')

            const verificationCode = searchVerificationCodeResult[0]

            const verificationResult = twoFactor.verifyToken(verificationCode.secret, code, 10)

            if(!verificationResult) throw new Error('Invalid code.')

            const { delta } = verificationResult

            if(delta === -1) throw new Error('Code is expired')

            else {
                const user = await UserModel.findOne({ $or: [{ email: userName.toLowerCase() }, { userName: userName.toLowerCase() }]})
                if(!user) throw new Error('Invalid Code')

                const token =  await generateToken(user)

                return { token }
            }

        } catch(err) {
            throw new Error(err.message)
        }
    },
    get2FASettings: async({ _id }) => {
        try {   
            const userDetails = await UserModel.findOne({ _id })

            if(!userDetails) throw new Error('Cannot fetch user 2 FA settings.')

            return { on2FA: userDetails.on2FA, phone: userDetails.phone }

        } catch(err) {
            throw new Error(err.message)
        }
    },
    change2FASettings: async({ phone, on2FA }, user) => {
        try {
            const updateRes = await UserModel.update({ _id: user._id }, {
                $set: {
                    phone,
                    on2FA
                }
            })

            return true
        } catch(err) {
            throw new Error(err.message)
        }
    }
}
