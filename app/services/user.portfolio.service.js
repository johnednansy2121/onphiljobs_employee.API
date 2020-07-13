module.exports = UserPortfolioService = {
    create: (data, user) => {
        return new Promise((resolve, reject) => {
            const { itemName, itemDescription, itemImageUrl, tags } = data

            UserProfilePortfolioModel.create({
                itemName,
                itemDescription,
                itemImageUrl,
                tags,
                metadata: {
                    owner: user._id,
                    dateCreated: new Date()
                }
            })
                .then(portfolio => {
                    UserProfileModel.findOne({ user: user._id })
                        .then(profile => {
                            let portfolios = [...profile.resume.portfolio, portfolio._id]
                            UserProfileModel.updateOne({ user: user._id }, {
                                $set: {
                                    'resume.portfolio': portfolios,
                                    'metadata.dateUpdated': new Date()
                                }
                            })
                                .then(updateRes => resolve(portfolio))
                                .catch(err => reject({ message: err.message }))
                        })
                        .catch(err => reject({ message: err.message }))
                })
                .catch(err => reject({ message: err.message }))
        })
    },
    getById: (id) => {
        return new Promise((resolve, reject) => {
            UserProfilePortfolioModel.findById(id)
                .then(portfolio => {
                    if(!portfolio) reject({ message: `Portfolio not found with id ${id}.`})
                    else resolve(portfolio)
                })
                .catch(err => reject({ message: err.message }))
        })
    },
    searchuserportfolio: (user) => {
        return new Promise((resolve, reject) => {
            UserProfilePortfolioModel.find({ 'metadata.owner': user._id }).sort({ sortOrder: 1 })
                .then(result => resolve(result))
                .catch(err =>{ reject({ message: err.message })})
        })
    },
    delete: (id, user) => {
        return new Promise((resolve, reject) => {
            UserProfilePortfolioModel.findOne({ _id: id, 'metadata.owner': user._id })
            .then(portfolio => {
                if(!portfolio) reject({ message: `Portfolio not found.`})
                else {
                    UserProfilePortfolioModel.remove(portfolio)
                    .then(removeRes => {
                        UserProfileModel.findOne({ user: user._id })
                        .then(profile => {
                            let portfolios = profile.resume.portfolio.filter(x => x.toString() != id)
                            UserProfileModel.updateOne({ user: user._id }, {
                                $set: {
                                    'resume.portfolio': portfolios,
                                    'metadata.dateUpdated': new Date()
                                }
                            })
                            .then(updateRes => resolve(true))
                            .catch(err => reject({ message: err.message }))
                        })
                        .catch(err => reject({ message: err.message }))
                    })
                    .catch(err => reject({ message: err.message }))
                }
            })
            .catch(err => reject({ message: err.message }))
        })
    },
    update: (data, user) => {
        return new Promise((resolve, reject) => {
            const { _id, itemName, itemImageUrl, itemDescription, tags } = data

            UserProfilePortfolioModel.findOne({ _id: _id, 'metadata.owner': user._id })
                .then(portfolio => {
                    if (!portfolio) reject({ message: `Portfolio not found.` })
                    else {
                        UserProfilePortfolioModel.updateOne({ _id: _id }, {
                            $set: {
                                itemName,
                                itemImageUrl,
                                itemDescription,
                                tags,
                                'metadata.dateUpdated': new Date()
                            }
                        })
                            .then(updateRes => resolve(data))
                            .catch(err => reject({ message: err.message }))
                    }
                })
                .catch(err => reject({ message: err.message }))
        })
    },
    getportfoliosbyusername: (username) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userName: username.toLowerCase() })
                .then(user => {
                    UserProfilePortfolioModel.find({ 'metadata.owner': user._id, isProtected: false }).sort({ sortOrder: 1 })
                        .then(portfolios => resolve(portfolios))
                        .catch(err => reject({ message: err.message }))
                })
                .catch(err => reject({ message: err.message }))
        })
    },
    swapOrder: (array, user) => new Promise((resolve, reject) => {
        console.log(array)
        let promises = []
        array.forEach(state => {
            promises.push(UserProfilePortfolioModel.update({ _id: state.id, 'metadata.owner': user._id }, {
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
        UserProfilePortfolioModel.findOne({ _id: id, 'metadata.owner': user._id })
            .then(result => {
                if(!result) reject({ message: 'Unable to proctect/unprotect data.'})
                else {
                    UserProfilePortfolioModel.update({ _id: id }, {
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