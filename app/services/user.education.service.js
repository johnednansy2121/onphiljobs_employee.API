module.exports = UserEducationService = {
    insertMany: (educations, user) => {
        return new Promise((resolve, reject) => {
            try {
                const educationList = []
                educations.forEach(x => {
                    educationList.push(new UserEducationModel({ ...x, metadata: { owner: user._id, dateCreated: new Date() } }))
                })

                UserEducationModel.insertMany(educationList)
                    .then(res => {
                        return new Promise((resolve, reject) => {
                            UserProfileModel.findOne({ user: user._id})
                                .then(profile => {
                                    UserProfileModel.updateOne({ user: user._id },
                                        {
                                            $set: {
                                                resume: {
                                                    education: [ ...profile.resume.education, ...educationList.map(x => { return x._id })]
                                                }
                                            }
                                        })
                                        .then(updateRes => {
                                            resolve(educationList)
                                        })
                                        .catch(error => reject({ message: error.message }))
                                })

                        })
                    })
                    .then(educationList => resolve(educationList))
                    .catch(error => {
                        reject({ message: error.message })
                    })
            } catch(error) {
                console.log(error)
            }
        })
    },
    getAll: (user) => {
        return new Promise((resolve, reject) => {
            UserEducationModel.find({ 'metadata.owner': user._id }).sort({ sortOrder: 1 })
                .then(educations => resolve(educations))
                .catch(error => reject({ message: error.message }))
        })
    },
    update: (inputEducation, user) => {
        return new Promise((resolve, reject) => {
            const { _id, institutionName, dateStarted, dateFinished, notes } = inputEducation
            UserEducationModel.findOne({ _id: _id })
                .then(education => {
                    if(education.metadata.owner.toString() != user._id) reject({ message: 'You are not allowed to edit this education entry.' })
                    let metadata = { ...education.metadata, dateUpdated: new Date() }
                    UserEducationModel.updateOne({ _id: _id }, {
                        $set: {
                            institutionName,
                            dateStarted,
                            dateFinished,
                            notes,
                            metadata
                        }
                    })
                    .then(updateRes => resolve(inputEducation))
                    .catch(error => reject({ message: error.message }))
                })
                .catch(error => reject({ message: error.message }))

        })
    },
    getById: (id, user) => {
        return new Promise((resolve, reject) => {
            UserEducationModel.findById(id)
                .then(education => {
                    if(!education) reject({ message: 'Education data is not found.' })
                    if(education.metadata.owner.toString() != user._id) reject({ message: 'This is not your education data. '})

                    resolve(education)
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    removeById: (id, user) => {
        return new Promise((resolve, reject) => {
            UserEducationModel.findById(id)
                .then(education => {
                    if(!education) reject({ message: 'Education is not found.' })
                    if(education.metadata.owner.toString() != user._id) reject({ message: 'You cannot delete this entry.' })
                    else {
                        UserEducationModel.remove({ _id: id })
                            .then(res => {
                                UserProfileModel.findOne({ user: user._id })
                                    .then(userProfile => {
                                        let educations = userProfile.resume.education.filter(x => x.toString() !== id)
                                        UserProfileModel.updateOne({ user: user._id }, {
                                            $set: {
                                                'resume.education' : educations,
                                                'metadata.dateUpdated': new Date()
                                            }
                                        })
                                        .then(result => resolve(true))
                                        .catch(error => reject({ message: error.message }))
                                    })
                            })
                            .catch(err => reject({message:err.message}))
                    }
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    geteducationlistbyusername: (username) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userName: username.toLowerCase() })
                .then(user => {
                    UserEducationModel.find({ 'metadata.owner': user._id, isProtected: false }).sort({ sortOrder: 1 })
                        .then(educations => resolve(educations))
                        .catch(err => reject({ message: err.message }))
                })
                .catch(err => reject({ message: err.message }))
        })
    },
    swapOrder: (array, user) => new Promise((resolve, reject) => {
        let promises = []
        array.forEach(state => {
            promises.push(UserEducationModel.update({ _id: state.id, 'metadata.owner': user._id }, {
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
        UserEducationModel.findOne({ _id: id, 'metadata.owner': user._id })
            .then(result => {
                if(!result) reject({ message: 'Unable to proctect/unprotect data.'})
                else {
                    UserEducationModel.update({ _id: id }, {
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
