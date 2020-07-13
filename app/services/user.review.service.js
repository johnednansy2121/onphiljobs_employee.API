module.exports = UserReviewService = {
    create: (data, user) => {
        return new Promise((resolve, reject) => {
            const { recipientId, reviewDescription } = data
            if(recipientId == user._id) reject({ message: 'You cannot create your own review.'})
            else {
                let result = {}
                UserProfileModel.findOne({ user: recipientId })
                .then(recipient => {
                    if(!recipient) reject({ message: 'recipient has no records yet.'})
                    else {
                        UserProfileReviewModel.create({
                            reviewDescription,
                            isDisplayed: false,
                            metadata: {
                                owner: user._id,
                                recipient: recipientId,
                                dateCreated: new Date()
                            }
                        })
                            .then(createRes => {
                                result = createRes
                                UserProfileModel.findOne({ user: recipientId })
                                    .then(profile => {
                                        let reviews = [...profile.resume.reviews, createRes._id]
                                        UserProfileModel.updateOne({ user: recipientId }, {
                                            $set: {
                                                'resume.reviews': reviews
                                            }
                                        })
                                        .then(updateRes => {
                                            UserProfileReviewModel.findById(result._id)
                                                .populate('metadata.owner')
                                                .then(reviewRes => resolve(reviewRes))
                                        })
                                        .catch(err => reject({ message: err.message }))
                                    })
                                    .catch(err => reject({ message: err.message }))
                            })
                            .catch(err => reject({ message: err.message }))
                    }
                })
                .catch(err => reject({ message: err.message }))
            }
        })
    },
    getallmyreviews: (user) => {
        return new Promise((resolve, reject) => {
            UserProfileReviewModel.find({ 'metadata.recipient': user._id }).sort({ sortOrder: 1 })
            .populate('metadata.owner')
            .then(reviews => resolve(reviews))
            .catch(err => reject({ message: err.message }))
        })
    },
    hideUnhideReview: (id, user) => {
        return new Promise((resolve, reject) => {
            UserProfileReviewModel.findOne({ 'metadata.recipient': user._id, _id: id })
            .then(review => {
                if(!review) reject({ message: 'review not found.' })
                else {
                    UserProfileReviewModel.updateOne({ _id: id}, {
                        $set: {
                            isDisplayed: !review.isDisplayed,
                            'metadata.dateUpdated': new Date()
                        }
                    })
                    .then(updateRes => {
                        review.isDisplayed = !review.isDisplayed
                        resolve(review)
                    })
                    .catch(err => reject({ message: err.message }))
                }
            })
            .catch(err => reject({ message: err.message }))
        })
    },
    getallreviewsbyusername: (username) => {
        return new Promise((resolve, reject) => {
           UserModel.findOne({ userName: username.toLowerCase() })
            .then(user => {
                UserProfileReviewModel.find({ 'metadata.recipient': user._id, isDisplayed: true, isProtected: false }).sort({ sortOrder: 1 })
                    .populate('metadata.owner', 'userName')
                    .then(reviews => resolve(reviews))
                    .catch(err => reject({ message: err.message }))
            })
            .catch(err => reject({ message: err.message }))
        })
    },
    swapOrder: (array, user) => new Promise((resolve, reject) => {
        let promises = []
        array.forEach(state => {
            promises.push(UserProfileReviewModel.update({ _id: state.id, 'metadata.recipient': user._id }, {
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
        UserProfileReviewModel.findOne({ _id: id, 'metadata.recipient': user._id })
            .then(achievementResult => {
                if(!achievementResult) reject({ message: 'Unable to proctect/unprotect data.'})
                else {
                    UserProfileReviewModel.update({ _id: id }, {
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
