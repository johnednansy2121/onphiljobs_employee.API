module.exports = UserAchievementService = {
    create: (data, user) => {
        return new Promise((resolve, reject) => {
            const { achievementName, achievementDescription, dateStarted, dateFinished} = data

            UserAchievementModel.create({
                achievementName,
                achievementDescription,
                dateStarted,
                dateFinished,
                metadata: {
                    owner: user._id,
                    dateCreated: new Date()
                }
            })
                .then(achievement => {
                    UserProfileModel.findOne({ user: user._id})
                        .then(profile => {
                            let achievements = [...profile.resume.achievements, achievement._id]

                            UserProfileModel.updateOne({ user: user._id }, {
                                $set: {
                                    'resume.achievements': achievements,
                                    'metadata.dateUpdated': new Date()
                                }
                            })
                                .then(updateRes => resolve(achievement))
                                .catch(err => reject({ message: err }))
                        })
                        .catch(err => reject({ message: err }))
                })
                .catch(err => reject({ message: err }))
        })
    },
    update: (data, user) => {
        return new Promise((resolve, reject) => {
            const { _id, achievementName, achievementDescription, dateStarted, dateFinished } = data
            UserAchievementModel.findOne({ _id: _id, 'metadata.owner': user._id })
                .then(achievement => {
                    if(!achievement) reject({ message: 'you are not allowed to update this achievement record.'})
                    else {
                        UserAchievementModel.updateOne({ _id: _id }, {
                            $set: {
                                achievementName,
                                achievementDescription,
                                dateStarted,
                                dateFinished,
                                'metadata.dateUpdated': new Date()
                            }
                        })
                            .then(updateRes => resolve({ _id, achievementName, achievementDescription, dateStarted, dateFinished  }))
                            .catch(err => reject({ message: err }))
                    }
                })
                .catch(err => reject({ message: err }))
        })
    },
    search: (user) => {
        return new Promise((resolve, reject) => {
            UserAchievementModel.find({ 'metadata.owner': user._id }).sort({ sortOrder: 1 })
                .then(achievements => resolve(achievements))
                .catch(err => reject({ message: err }))
        })
    },
    getById: (id, user) => {
        return new Promise((resolve, reject) => {
            UserAchievementModel.findOne({ _id: id, 'metadata.owner': user._id })
                .then(achievement => {
                    if(!achievement) reject({ message: 'you are not allowed to view this achievement.'})
                    else {
                        resolve(achievement)
                    }
                })
                .catch(err => reject({ message: err }))
        })
    },
    delete: (id, user) => {
        return new Promise((resolve, reject) => {
            UserAchievementModel.findOne({ _id: id, 'metadata.owner': user._id })
                .then(achievement => {
                    if(!achievement) reject({ message: 'you are not allowed to delete achievement record.'})
                    else {
                        UserAchievementModel.remove(achievement)
                            .then(removeRes => {
                                UserProfileModel.findOne({ user: user._id })
                                    .then(profile => {
                                        let achievements = profile.resume.achievements.filter(x => x.toString() !== id)
                                        UserProfileModel.updateOne({ user: user._id }, {
                                            $set: {
                                                'resume.achievements': achievements,
                                                'metadata.dateUpdated': new Date()
                                            }
                                        })
                                            .then(updateRes => resolve(true))
                                            .catch(err => reject(err))
                                    })
                                    .catch(err => reject({ message: err }))
                            })
                            .catch(err => reject({ message: err }))
                    }
                })
                .catch(err => ({ message: err }))
        })
    },
    insertMany: (datas, user) => {
        return new Promise((resolve, reject) => {
            let achievements = []
            datas.forEach(x => {
                const { achievementName, achievementDescription, dateStarted, dateFinished} = x
                achievements.push(new UserAchievementModel({
                    achievementName,
                    achievementDescription,
                    dateStarted,
                    dateFinished,
                    metadata: {
                        owner: user._id,
                        dateCreated: new Date()
                    }
                }))
            })

            UserAchievementModel.insertMany(achievements)
                .then(insertRes => {
                    UserProfileModel.findOne({ user: user._id })
                        .then(profile => {
                            let achievementsRes = [...profile.resume.achievements, ...achievements.map(x => { return x._id })]
                            UserProfileModel.updateOne({ user: user._id }, {
                                $set: {
                                    'resume.achievements': achievementsRes,
                                    'metadata.dateUpdated': new Date()
                                }
                            })
                                .then(updateRes => resolve(achievements))
                                .catch(err => { console.log(err); reject({ message: err })})
                        })
                        .catch(err => { console.log(err); reject({ message: err }) })
                })
                .catch(err =>{ console.log(err); reject({ message: err })})
        })
    },
    getachievementsbyusername: (username) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userName: username.toLowerCase() })
                .then(user => {
                    UserAchievementModel.find({ 'metadata.owner': user._id, isProtected: false }).sort({ sortOrder: 1})
                    .then(result => resolve(result))
                    .catch(err => reject({ message: err.message }))
                })
                .catch(err => reject({ messge: err.message }))
        })
    },
    sortOrder: (array, user) => new Promise((resolve, reject) => {
        let promises = []
        array.forEach(state => {
            promises.push(UserAchievementModel.update({ _id: state.id, 'metadata.owner': user._id }, {
                $set: {
                    sortOrder: state.position,
                    'metadata.dateUpdated': new Date()
                }
            }
            ))
        })
        Promise.all(promises).then(() => resolve(true)).catch(err => reject({ message: err.message }))
    }),
    toggleProtect: (id, user) => new Promise((resolve, reject) => {
        UserAchievementModel.findOne({ _id: id, 'metadata.owner': user._id })
            .then(achievementResult => {
                if(!achievementResult) reject({ message: 'Unable to proctect/unprotect data.'})
                else {
                    UserAchievementModel.update({ _id: id }, {
                        $set: {
                            isProtected: !achievementResult.isProtected,
                            'metadata.dateUpdated': new Date()
                        }
                    })
                    .then(() => resolve(true))
                    .catch(err => reject({ message: err.message }))
                }
            })
            .catch(err => reject({ message: err.messsage }))
    })
}