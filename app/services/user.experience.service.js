module.exports = UserExperienceService = {
    create: (data, user) => {
        return new Promise((resolve, reject) => {
            const { organizationName, jobTitle, jobDescription, dateStarted, dateFinished, location } = data
            let result;
            UserProfileExperienceModel.create({
                organizationName,
                jobTitle,
                jobDescription,
                dateStarted,
                location,
                dateFinished,
                metadata: {
                    owner: user._id,
                    dateCreated: new Date()
                }
            })
            .then(experience => {
                result = experience
                UserProfileModel.findOne({ user: user._id})
                    .then(profile => {
                        let experiences = [...profile.resume.experience, experience._id]
                        UserProfileModel.updateOne({ user: user._id }, {
                            $set: {
                                'resume.experience': experiences,
                                'metadata.dateUpdated': new Date()
                            }
                        })
                            .then(updateRes => resolve(result))
                            .catch(err => reject({ message: err }))
                    })
                    .catch(err => reject({ message: err }))
            })
            .catch(err => reject({ message: err }))
        })
    },
    insertMany: (datas, user) => {
        return new Promise((resolve, reject) => {
            let workExperiences = []
            datas.forEach(x => {
                const { organizationName, jobTitle, jobDescription, dateStarted, dateFinished, location  } = x
                workExperiences.push(new UserProfileExperienceModel({
                    organizationName,
                    jobTitle,
                    jobDescription,
                    dateStarted,
                    dateFinished,
                    location,
                    metadata: {
                        owner: user._id,
                        dateCreated: new Date()
                    }
                }))
            })

            UserProfileExperienceModel.insertMany(workExperiences)
                .then(insertResult => {
                    UserProfileModel.findOne({ user: user._id })
                        .then(profile => {
                            let experiences = [...profile.resume.experience, ...workExperiences.map(x => { return x._id })]
                            UserProfileModel.updateOne({ user: user._id}, {
                                $set: {
                                    'resume.experience': experiences,
                                    'metadata.dateUpdated': new Date()
                                }
                            })
                                .then(updateRes => resolve(workExperiences))
                                .catch(err => reject({ message: err }))
                        })
                        .catch(err => reject({ message: err}))
                })
                .catch(err => reject({ message: err }))
        })
    },
    getById: (id, user) => {
        return new Promise((resolve, reject) => {
            UserProfileExperienceModel.findById(id)
                .then(experience => {
                    if(!experience) reject({ message: 'Work experience not found with that id.'})
                    if(experience.metadata.owner.toString() != user._id) reject({ message: 'you are not allowed to retrieve work experience record.'})
                    else {
                        resolve(experience)
                    }
                })
                .catch(err => reject({ message: err }))
        })
    },
    search: (user) => {
        return new Promise((resolve, reject) => {
            UserProfileExperienceModel.find({ 'metadata.owner': user._id }).sort({ sortOrder: 1 })
                .then(records => resolve(records))
                .catch(err => reject({ message: err }))
        })
    },
    update: (data, user) => {
        return new Promise((resolve, reject) => {
            const { _id, organizationName, jobTitle, jobDescription, dateStarted, dateFinished, location } = data
            UserProfileExperienceModel.findOne({ _id: _id, 'metadata.owner': user._id })
                .then(experience => {
                    if(!experience) reject({ message: 'Work experience could not be updated.'})
                    else {
                        UserProfileExperienceModel.updateOne({ _id: _id }, {
                            $set: {
                                organizationName,
                                jobTitle,
                                jobDescription,
                                dateStarted,
                                location,
                                dateFinished,
                                'metadata.dateUpdated': new Date()
                            }
                        })
                            .then(updateRes => resolve({ _id, organizationName, jobTitle, jobDescription, dateStarted, dateFinished }))
                            .catch(err => reject({ message: err }))
                    }
                })
                .catch(err => reject({ message: err }))
        })
    },
    remove: (id, user) => {
        return new Promise((resolve, reject) => {
            UserProfileExperienceModel.findOne({ _id: id, 'metadata.owner': user._id })
                .then(experience => {
                    if(!experience) reject({ message: 'you cannot delete this work experience record.'})
                    else {
                        UserProfileExperienceModel.remove(experience)
                            .then(removeRes => {
                                UserProfileModel.findOne({ user: user._id })
                                    .then(profile => {
                                        let experiences = profile.resume.experience.filter(x => x._id.toString() != id)
                                        UserProfileModel.updateOne({ user: user._id}, {
                                            $set: {
                                                'resume.experience' : experiences,
                                                'metadata.dateUpdated': new Date()
                                            }
                                        })
                                            .then(updateRes => resolve(true))
                                            .catch(err => reject({ message: err }))
                                    })
                                    .catch(err => reject({ message: err }))
                            })
                            .catch(err => reject({ message: err }))
                    }
                })
                .catch(err => reject({ message: err }))
        })
    },
    getexperiencesbyusername: (username) => {
        return new Promise((resolve, reject) => {
           UserModel.findOne({ userName: username.toLowerCase() })
            .then(user => {
                UserProfileExperienceModel.find({ 'metadata.owner': user._id, isProtected: false }).sort({ sortOrder: 1 })
                    .then(experiences => resolve(experiences))
                    .catch(err => reject({ message: err.message }))
            })
            .catch(err => reject({ message: err.message }))
        })
    },
    swapOrder: (array, user) => new Promise((resolve, reject) => {
        let promises = []
        array.forEach(state => {
            promises.push(UserProfileExperienceModel.update({ _id: state.id, 'metadata.owner': user._id }, {
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
        UserProfileExperienceModel.findOne({ _id: id, 'metadata.owner': user._id })
            .then(result => {
                if(!result) reject({ message: 'Unable to proctect/unprotect data.'})
                else {
                    UserProfileExperienceModel.update({ _id: id }, {
                        $set: {
                            isProtected: !result.isProtected,
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