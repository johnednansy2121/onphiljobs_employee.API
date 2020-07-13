const bcrypt = require('bcryptjs')
const EmailHelper = require(basedir + '/helpers/emailer')
const uuid = require('uuid')

encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.getSalt(10)
            .then(salt => { return bcrypt.hash(password, salt) })
            .then(encryptedPassword => resolve(encryptedPassword))
            .catch(error => reject({ message: error.message }))
    })
}

updateUserPassword = (user, encryptedPassword) => {
    return new Promise((resolve, reject) => {
        user.password = encryptedPassword
        user.dateUpdated = new Date()
        UserModel.updateOne({ _id: user._id }, 
        {
            $set: {
                password: encryptedPassword
            }
        })
        .then(data => resolve(user))
        .catch(err => reject({ message: err.message }))
    })
}

updateForgotPassword = (id) => {
    return new Promise((resolve, reject) => {
        ForgotPasswordModel.updateOne({ _id: id},
        {
            $set: {
                isUsed: true
            }
        })
        .then(result => resolve(true))
        .catch(error => reject({ message: error.message }))
    })
}

changePassword = (forgotpassword, password) => {
    return new Promise((resolve, reject) => {
        const { user } = forgotpassword
        if(password.length < 6) reject({ message: 'Password length should be greater than 6.'})
        else {
            encryptPassword(password)
            .then(encryptedPassword => {
                return updateUserPassword(user, encryptedPassword)
            })
            .then(user => {
                return updateForgotPassword(forgotpassword._id)
            })
            .then(result => resolve(result))
            .catch(error => reject({ message: error.message }))
        }
    })
}


const validatePassword = async(password, encryptedPassword) => {
    try {
        const result = await bcrypt.compare(password, encryptedPassword)

        return result
    } catch(err) {
        throw new Error(err.message)
    }
}


module.exports = ForgotPasswordService = {
    create: (data) => {
        return new Promise((resolve, reject) => {
            const { userName } = data
            let userData;
            UserModel.findOne({ $or: [{email: userName.toLowerCase()}, {userName: userName.toLowerCase()}]})
                .then(user => {
                    if(!user)
                        reject({ message: 'username or email not found.'})
                    else {
                        userData = user
                        return ForgotPasswordModel.create({ code: uuid.v4().toUpperCase(), user: user._id, expiresIn: new Date(new Date().getTime() + 15 * 60000), dateCreated: new Date() })
                    }
                })
                .then(forgotpassword => {
                    EmailHelper.sendEmail('forgot.password', { link: Configuration.CLIENT_URL + `/auth/forgot/changepassword?code=${forgotpassword.code}` }, { to: userData.email, subject: 'Forgot Password' })
                    resolve(true)
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    changepassword: ({ code, password, confirmPassword }) => {
        return new Promise((resolve, reject) => {
            if(password.length < 6) reject({ message: 'Password should be length must 6 or greater.'})
            if(password != confirmPassword) reject({ message: 'Password and Confirm password doesnt match.'})
            ForgotPasswordModel.findOne({ code: code, isUsed: false, expiresIn: { $gte: new Date() }})
                .populate('user')
                .then(forgotpassword => {
                    if(!forgotpassword)
                        reject({ message: 'code is invalid or already expired.'})
                    else
                    {
                        return changePassword(forgotpassword, password)
                    }

                })
                .then(response => resolve(response))
                .catch(error => reject({ message: error.message }))
        })
    },
    userChangePassword: async({ oldPassword, newPassword, confirmPassword}, user) => {
        try {
            if(newPassword !== confirmPassword) throw new Error('New password and confirm password does not match.')

            const userDetails = await UserModel.findOne({ _id: user._id })

            if(!userDetails) throw new Error('User not found.')

            const validateOldPasswordResult = await validatePassword(oldPassword, userDetails.password)

            if(!validateOldPasswordResult) throw new Error('Invalid old password.')

            const encryptedPasswordResult = await encryptPassword(newPassword)

            await UserModel.update({ _id: user._id }, {
                $set: {
                    password: encryptedPasswordResult
                }
            })

            return true
        } catch(err) {
            throw new Error(err.message)
        }
    }
}