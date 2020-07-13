module.exports = UserProfileSkillService = {
    insertMany: (data, user) => {
        return new Promise((resolve, reject) => {
            let skills = []
            data.forEach(x => {
                const { skillName, skillLevel, yearsOfExperience, notes } = x
                skills.push(new UserProfileSkillModel({ skillName, skillLevel, yearsOfExperience, notes, metadata: { owner: user._id, dateCreated: new Date() }}))
            })

            UserProfileSkillModel.insertMany(skills)
                .then(result => {
                    UserProfileModel.findOne({ user: user._id })
                        .then(profile => {
                            UserProfileModel.updateOne({ user: user._id }, {
                                $set: {
                                    'resume.skills': [ ...profile.resume.skills, ...skills.map(x => { return x._id }) ],
                                    'metadata.dateUpdated': new Date()
                                }
                            })
                            .then(updateRes => resolve(skills))
                            .catch(error => reject({ message: error.message }))
                        })
                        .catch(err => reject({ message: err.message }))
                })
                .catch(err => reject({ message: err.message }))
        })
    },
    create: (data, user) => {
        return new Promise((resolve, reject) => {
            const { skillName, skillLevel, yearsOfExperience, notes } = data
            let result
            UserProfileSkillModel.create({ skillName, skillLevel, yearsOfExperience, notes, metadata: { owner: user._id, dateCreated: new Date() } })
                .then(skill => {
                    result = skill
                    UserProfileModel.findOne({ user: user._id })
                        .then(profile => {
                            const skills = [...profile.resume.skills, skill._id]
                            UserProfileModel.updateOne({ user: user._id }, {
                                $set: {
                                    'resume.skills': [...skills],
                                    'metadata.dateUpdated': new Date()
                                }
                            })
                                .then(updateRes => resolve(result))
                                .catch(error => {
                                    reject({ message: error })
                                })
                        })
                        .catch(err => reject({ message: err }))
                })
                .catch(err => reject({ message: err }))
        })
    },
    getAll: (user) => {
        return new Promise((resolve, reject) => {
            UserProfileSkillModel.find({ 'metadata.owner' : user._id }).sort({ sortOrder: 1 })
                .then(skills => resolve(skills))
                .catch(err => reject({ message: err.message }))
        })
    },
    getById: (id, user) => {
        return new Promise((resolve, reject) => {
            UserProfileSkillModel.findById(id)
                .then(skill => {
                    if(!skill) reject({ message: `Skill not found with id of ${id}.`})
                    if(skill.metadata.owner.toString() != user._id) reject({ message: 'You are not allowed to get this skill details.'})
                    else {
                        resolve(skill)
                    }
                })
                .catch(err => reject({ message: err.message }))
        })
    },
    update: (data, user) => {
        return new Promise((resolve, reject) => {
            const { _id, skillName, skillLevel, yearsOfExperience, notes } = data
            UserProfileSkillModel.findById(_id)
                .then(skill => {
                    if (!skill) reject({ message: `Skill not found with id of ${id}.` })
                    if (skill.metadata.owner.toString() != user._id) reject({ message: 'You are not allowed to edit this skill details.' })
                    else {
                        UserProfileSkillModel.updateOne({ _id: _id }, {
                            $set: {
                                skillName,
                                skillLevel,
                                yearsOfExperience,
                                notes,
                                'metadata.dateUpdated': new Date()
                            }
                        })
                        .then(updateRes => resolve({ _id, skillName, skillLevel, yearsOfExperience, notes }))
                        .catch(err => reject({ message: err.message }))
                    }
                })
                .catch(err => reject({ message: err.message }))
        })
    },
    delete: (id, user) => {
        return new Promise((resolve, reject) => {
            UserProfileSkillModel.findById(id)
                .then(skill => {
                    if (!skill) reject({ message: `Skill not found with id of ${id}.` })
                    if (skill.metadata.owner.toString() != user._id) reject({ message: 'You are not allowed to delete this skill details.' })
                    else {
                        UserProfileSkillModel.remove(skill)
                            .then(removeRes => {
                                UserProfileModel.findOne({ user: user._id })
                                    .then(profile => {
                                        let skills = profile.resume.skills.filter(x => x.toString() !== id)
                                        UserProfileModel.updateOne({ user: user._id}, {
                                            $set: {
                                                'resume.skills': skills,
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
    getskillsbyusername: (username) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userName: username.toLowerCase() })
                .then(user =>{
                    UserProfileSkillModel.find({ 'metadata.owner': user._id, isProtected: false }).sort({ sortOrder: 1 })
                        .then(skills => resolve(skills))
                        .catch(err => reject({ message: err.message }))
                })
                .catch(err => reject({ message: err.message }))
        })
    },
    swapOrder: (array, user) => new Promise((resolve, reject) => {
        let promises = []
        array.forEach(state => {
            promises.push(UserProfileSkillModel.update({ _id: state.id, 'metadata.owner': user._id }, {
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
        UserProfileSkillModel.findOne({ _id: id, 'metadata.owner': user._id })
            .then(result => {
                if(!result) reject({ message: 'Unable to proctect/unprotect data.'})
                else {
                    UserProfileSkillModel.update({ _id: id }, {
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