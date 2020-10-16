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

comparePassword = (password, recruiter) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, recruiter.password)
            .then(res => {
                if(res)
                    resolve(recruiter)
                else
                    reject({ message: 'invalid credentials'})
            }).catch(err => {
                reject(err)
            })
    })
}

generateToken = (recruiter) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ email: recruiter.email }, Configuration.JWT_KEY, { expiresIn: '1d' }, (error, token) => {
            if(error)
                reject(error)
            resolve(token)
        })
    })
}

verifyRecruiter = (recruiter) => {
    return new Promise((resolve, reject) => {
        RecruiterModel.updateOne({ _id: recruiter._id }, {
            $set: {
                isVerified: true,
                metadata: {
                    ...recruiter.metadata,
                    dateUpdated: new Date()
                }
            }
        })
        .then(result => resolve(recruiter))
        .catch(error => reject({ message: error.message }))
    })
}

module.exports = RecruiterService = {
    signup: (data) => {
        return new Promise((resolve, reject) => {
            const { email, password, confirmPassword, userName, tag, phone, on2FA } = data
            if(on2FA) {
                if(phone === '' || phone === undefined) reject({ message: 'If 2-FA is on, mobile number is required.' })
            }
            var recruiterName = userName;
            if(recruiterName.includes(' ')) reject({ message: 'recruiter name must not have whitespace.'})
            if(!regex.email.test(email)) reject({ message: 'Email is not valid' })
            if(password != confirmPassword)
                reject(`Password and Confirm Password doesn't match.`)
            encryptPassword(password)
                .then(encryptedPassword => { return RecruiterModel.create({ email: email.toLowerCase(), recruiterName: recruiterName.toLowerCase(), password: encryptedPassword, registrationTag: tag, phone, on2FA, metadata: { verificationToken: uuid.v4(), dateCreated: new Date() } })})
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
                var recruiterName = userName;
                let recruiterDetails
                RecruiterModel.findOne({ $or: [{ email: recruiterName.toLowerCase() }, { recruiterName: recruiterName.toLowerCase() }]})
                    .then(data => {
                        recruiterDetails = data
                        if (!data) reject({ message: 'invalid credentials'})
                        if (!data.isVerified) reject({ message: 'email is not verified.'})
                        return comparePassword(password, data)
                    })
                    .then(recruiter => { 
                        if(recruiterDetails.on2FA) {
                            twoFAService.generate2FACode(recruiterDetails.phone, recruiterDetails.email).then(() => {
                                resolve({ on2FA : true })
                            })
                        } else
                            return generateToken(recruiter) 
                    })
                    .then(token => {
                        if(recruiterDetails.on2FA) {
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
            RecruiterModel.findOne({ 'metadata.verificationToken': code })
                .then(recruiter => {
                    if(!recruiter) reject({ message: 'code is invalid.'})
                    return verifyRecruiter(recruiter)
                })
                .then(recruiter => {
                    return generateToken(recruiter)
                })
                .then(token => {
                    resolve(token)
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    getRecruiterById: (id) => {
        return new Promise((resolve, reject) => {
            RecruiterModel.findById(id)
                .then(recruiter => {
                    if(!recruiter) reject({ message: 'recruiter not found.'})
                    resolve(recruiter)
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    twoFALogin: async({ recruiterName, code}) => {
        try {
            const searchVerificationCodeResult = await twoFactorModel.find({ number: recruiterName, code }).sort({ 'metadata.dateCreated': -1 })

            if(searchVerificationCodeResult.length <= 0) throw new Error('Invalid code.')

            const verificationCode = searchVerificationCodeResult[0]

            const verificationResult = twoFactor.verifyToken(verificationCode.secret, code, 10)

            if(!verificationResult) throw new Error('Invalid code.')

            const { delta } = verificationResult

            if(delta === -1) throw new Error('Code is expired')

            else {
                const recruiter = await RecruiterModel.findOne({ $or: [{ email: recruiterName.toLowerCase() }, { recruiterName: recruiterName.toLowerCase() }]})
                if(!recruiter) throw new Error('Invalid Code')

                const token =  await generateToken(recruiter)

                return { token }
            }

        } catch(err) {
            throw new Error(err.message)
        }
    },
    get2FASettings: async({ _id }) => {
        try {   
            const recruiterDetails = await RecruiterModel.findOne({ _id })

            if(!recruiterDetails) throw new Error('Cannot fetch recruiter 2 FA settings.')

            return { on2FA: recruiterDetails.on2FA, phone: recruiterDetails.phone }

        } catch(err) {
            throw new Error(err.message)
        }
    },
    change2FASettings: async({ phone, on2FA }, recruiter) => {
        try {
            const updateRes = await RecruiterModel.update({ _id: recruiter._id }, {
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
