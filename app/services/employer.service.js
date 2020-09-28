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

comparePassword = (password, employer) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, employer.password)
            .then(res => {
                if(res)
                    resolve(employer)
                else
                    reject({ message: 'invalid credentials'})
            }).catch(err => {
                reject(err)
            })
    })
}

generateToken = (employer) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ email: employer.email }, Configuration.JWT_KEY, { expiresIn: '1d' }, (error, token) => {
            if(error)
                reject(error)
            resolve(token)
        })
    })
}

verifyEmployer = (employer) => {
    return new Promise((resolve, reject) => {
        EmployerModel.updateOne({ _id: employer._id }, {
            $set: {
                isVerified: true,
                metadata: {
                    ...employer.metadata,
                    dateUpdated: new Date()
                }
            }
        })
        .then(result => resolve(employer))
        .catch(error => reject({ message: error.message }))
    })
}

module.exports = EmployerService = {
    signup: (data) => {
        return new Promise((resolve, reject) => {
            const { email, password, confirmPassword, userName, tag, phone, on2FA } = data
            if(on2FA) {
                if(phone === '' || phone === undefined) reject({ message: 'If 2-FA is on, mobile number is required.' })
            }
            var employerName = userName;
            if(employerName.includes(' ')) reject({ message: 'employer name must not have whitespace.'})
            if(!regex.email.test(email)) reject({ message: 'Email is not valid' })
            if(password != confirmPassword)
                reject(`Password and Confirm Password doesn't match.`)
            encryptPassword(password)
                .then(encryptedPassword => { return EmployerModel.create({ email: email.toLowerCase(), employerName: employerName.toLowerCase(), password: encryptedPassword, registrationTag: tag, phone, on2FA, metadata: { verificationToken: uuid.v4(), dateCreated: new Date() } })})
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
                var employerName = userName;
                let employerDetails
                EmployerModel.findOne({ $or: [{ email: employerName.toLowerCase() }, { employerName: userName.toLowerCase() }]})
                    .then(data => {
                        employerDetails = data
                        if (!data) reject({ message: 'invalid credentials'})
                        if (!data.isVerified) reject({ message: 'email is not verified.'})
                        return comparePassword(password, data)
                    })
                    .then(employer => { 
                        if(employerDetails.on2FA) {
                            twoFAService.generate2FACode(employerDetails.phone, employerDetails.email).then(() => {
                                resolve({ on2FA : true })
                            })
                        } else
                            return generateToken(employer) 
                    })
                    .then(token => {
                        if(employerDetails.on2FA) {
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
            EmployerModel.findOne({ 'metadata.verificationToken': code })
                .then(employer => {
                    if(!employer) reject({ message: 'code is invalid.'})
                    return verifyEmployer(employer)
                })
                .then(employer => {
                    return generateToken(employer)
                })
                .then(token => {
                    resolve(token)
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    getEmployerById: (id) => {
        return new Promise((resolve, reject) => {
            EmployerModel.findById(id)
                .then(employer => {
                    if(!employer) reject({ message: 'employer not found.'})
                    resolve(employer)
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    twoFALogin: async({ employerName, code}) => {
        try {
            const searchVerificationCodeResult = await twoFactorModel.find({ number: employerName, code }).sort({ 'metadata.dateCreated': -1 })

            if(searchVerificationCodeResult.length <= 0) throw new Error('Invalid code.')

            const verificationCode = searchVerificationCodeResult[0]

            const verificationResult = twoFactor.verifyToken(verificationCode.secret, code, 10)

            if(!verificationResult) throw new Error('Invalid code.')

            const { delta } = verificationResult

            if(delta === -1) throw new Error('Code is expired')

            else {
                const employer = await EmployerModel.findOne({ $or: [{ email: employerName.toLowerCase() }, { employerName: employerName.toLowerCase() }]})
                if(!employer) throw new Error('Invalid Code')

                const token =  await generateToken(employer)

                return { token }
            }

        } catch(err) {
            throw new Error(err.message)
        }
    },
    get2FASettings: async({ _id }) => {
        try {   
            const employerDetails = await EmployerModel.findOne({ _id })

            if(!employerDetails) throw new Error('Cannot fetch employer 2 FA settings.')

            return { on2FA: employerDetails.on2FA, phone: employerDetails.phone }

        } catch(err) {
            throw new Error(err.message)
        }
    },
    change2FASettings: async({ phone, on2FA }, employer) => {
        try {
            const updateRes = await EmployerModel.update({ _id: employer._id }, {
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
