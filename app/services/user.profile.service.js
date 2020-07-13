const { v4 } = require('uuid')

const getVideoId = (url) => {
    let videoId = ''
    if(url != '' && url != null) {
        let urlName = new URL(url)
        if(urlName.host == 'youtu.be') {
            videoId = urlName.pathname.replace('/', '')
        } else {
            let parameters = url.split('?')[1]
            let searchParams = new URLSearchParams(parameters)
            videoId = searchParams.get('v')
        }
    }

    return videoId
}

module.exports = UserProfileService = {
    getMyProfile: async(user) => {
        try {
            
            const profileRes = await UserProfileModel.findOne({ user: user._id })
                .populate({
                    path: 'premium.subscription',
                    model: 'subscription'
                })

            return { 
                successful: profileRes ? true : false,
                model: profileRes,
                message: 'Successfully retrieve record.'
            }
        } catch(err) {
            throw new Error(err.message)
        }
    },
    create: ({ firstName, lastName, aboutMe, displayPicture, videoUrl, socialLinks }, user) => {
        return new Promise((resolve, reject) => {
            UserProfileModel.create({ user: user._id, firstName, lastName, aboutMe, displayPicture, videoUrl: getVideoId(videoUrl), socialLinks, privateCode: v4() , metadata: { dateCreated: new Date() }})
                .then(profile => {
                    return new Promise((resolve, reject) => {
                        UserModel.findById(user._id)
                            .then(user => {
                                UserModel.updateOne({ _id: user._id },
                                    {
                                        $set: {
                                            metadata: {
                                                dateCreated: user.metadata.dateCreated,
                                                hasProfile: true,
                                                dateUpdated: new Date(),
                                                verificationToken: user.metadata.verificationToken
                                            }
                                        }
                                    })
                                    .then(resolve(profile))
                            })
                    })
                })
                .then(profile => resolve(profile))
                .catch(error => reject({ message: error.message }))
        })
    },
    update: async({ _id, firstName, lastName, aboutMe, displayPicture, videoUrl, socialLinks, jobTitle, location }, user) => {
        try {
            const userProfile = await UserProfileModel.findOne({ user: user._id, _id })

            if(!userProfile) throw new Error('You are updating a profile that does not belong to you.')

            await UserProfileModel.updateOne({ _id }, {
                $set: {
                    firstName,
                    lastName,
                    aboutMe,
                    displayPicture,
                    videoUrl: getVideoId(videoUrl),
                    socialLinks,
                    jobTitle,
                    location,
                    metadata: {
                        dateCreated: userProfile.metadata.dateCreated,
                        dateUpdated: new Date()
                    }
                }
            })

            const updateProfile = await UserProfileModel.findOne({ _id, user: user._id })
                .populate({
                    path: 'premium.subscription',
                    model: 'subscription'
                })
            
            console.log(updateProfile)
            return updateProfile
        } catch(err) {
            throw new Error(err.message)
        }
    },
    getProfileByUserName: (userName) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userName: userName})
                .then(user => {
                    if(!user) reject({ message: 'profile not found with that user name.'})
                    else {
                        return new Promise((resolve, reject) => {
                            UserProfileModel.findOne({ user: user._id })
                                .then(userprofile => {
                                    if(!userprofile) reject({ message: 'profile is not yet set or not yet created.'})
                                    else resolve(userprofile)
                                })
                        })
                    }
                })
                .then(userprofile => resolve(userprofile))
                .catch(error => reject({ message: error.message }))
        })
    },
    search: async({ filter, pageSize, pageNum, orderBy }) =>  {
        try {
            const totalItems = await UserProfileModel.find(filter)

            let searchItems = []
            const offset = (pageNum - 1) * pageSize
            if(orderBy !== orderBy) {
                searchItems = await UserProfileModel.find(filter).skip(offset).limit(pageSize).sort(orderBy)
            } else {
                searchItems = await UserProfileModel.find(filter).skip(offset).limit(pageSize)
            }

            const items = []
            searchItems.forEach(item => {
                items.push({
                    _id: item.user,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    location: item.location,
                    displayPicture: item.displayPicture,
                    jobTitle: item.jobTitle,
                    premium: {
                        pro: item.premium.hasProSubscription,
                        interviewed: item.premium.hasInterview,
                        verified: item.isProfileVerified
                    },
                    resume: {
                        achievements: item.resume.achievements.length,
                        education: item.resume.education.length,
                        experience: item.resume.experience.length,
                        portfolio: item.resume.portfolio.length,
                        skills: item.resume.skills.length
                    }
                })
            })

            return {
                Items: items,
                TotalItems: totalItems.length,
                PageNum: pageNum,
                PageSize: pageSize,
                Message: 'Successfully retreive records.',
                Successful: true
            }
        } catch(err){
            throw new Error(err.message)
        }
    },
    getProfileWithPrivateInfo: async(code, name) => {
        try {
            
            const userResult = await UserModel.findOne({ userName: name })
            
            if(!userResult) throw new Error('User profile not found with name of ' + name + '.')

            const userProfile = await UserProfileModel.findOne({ user: userResult._id, privateCode: code })

            if(!userProfile) throw new Error('User profile not found with name of ' + name + '.')

            const achievements = await UserAchievementModel.find({ 'metadata.owner': userProfile.user })

            const educations = await UserEducationModel.find({ 'metadata.owner': userProfile.user })
            
            const experiences = await UserProfileExperienceModel.find({ 'metadata.owner': userProfile.user })

            const portfolios = await UserProfilePortfolioModel.find({ 'metadata.owner': userProfile.user })

            const reviews = await UserProfileReviewModel.find({ 'metadata.recipient': userProfile.user, isDisplayed: true })

            const skills = await UserProfileSkillModel.find({ 'metadata.owner': userProfile.user })

            return {
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                jobTitle: userProfile.jobTitle,
                location: userProfile.location,
                premium: userProfile.premium,
                videoUrl: userProfile.videoUrl,
                aboutMe: userProfile.aboutMe,
                socialLinks: userProfile.socialLinks,
                displayPicture: userProfile.displayPicture,
                resume: {
                    achievements,
                    educations,
                    experiences,
                    portfolios,
                    reviews,
                    skills
                }
            }
        } catch(err) {
            throw new Error(err.message)
        }
    }
}