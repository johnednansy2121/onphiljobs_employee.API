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

module.exports = RecruiterProfileService = {
    getMyProfile: async(recruiter) => {
        try {
            
            const profileRes = await RecruiterProfileModel.findOne({ recruiter: recruiter._id })
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
    create: ({ firstName, lastName, aboutMe, displayPicture, videoUrl, socialLinks }, recruiter) => {
        return new Promise((resolve, reject) => {
            RecruiterProfileModel.create({ recruiter: recruiter._id, firstName, lastName, aboutMe, displayPicture, videoUrl: getVideoId(videoUrl), socialLinks, privateCode: v4() , metadata: { dateCreated: new Date() }})
                .then(profile => {
                    return new Promise((resolve, reject) => {
                        RecruiterModel.findById(recruiter._id)
                            .then(recruiter => {
                                RecruiterModel.updateOne({ _id: recruiter._id },
                                    {
                                        $set: {
                                            metadata: {
                                                dateCreated: recruiter.metadata.dateCreated,
                                                hasProfile: true,
                                                dateUpdated: new Date(),
                                                verificationToken: recruiter.metadata.verificationToken
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
    update: async({ _id, firstName, lastName, aboutMe, displayPicture, videoUrl, socialLinks, jobTitle, location }, recruiter) => {
        try {
            const recruiterProfile = await RecruiterProfileModel.findOne({ recruiter: recruiter._id, _id })

            if(!recruiterProfile) throw new Error('You are updating a profile that does not belong to you.')

            await RecruiterProfileModel.updateOne({ _id }, {
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
                        dateCreated: recruiterProfile.metadata.dateCreated,
                        dateUpdated: new Date()
                    }
                }
            })

            const updateProfile = await RecruiterProfileModel.findOne({ _id, recruiter: recruiter._id })
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
    getProfileByRecruiterName: (recruiterName) => {
        return new Promise((resolve, reject) => {
            RecruiterModel.findOne({ recruiterName: recruiterName})
                .then(recruiter => {
                    if(!recruiter) reject({ message: 'recruiter profile not found with that user name.'})
                    else {
                        return new Promise((resolve, reject) => {
                            RecruiterProfileModel.findOne({ recruiter: recruiter._id })
                                .then(recruiterprofile => {
                                    if(!recruiterprofile) reject({ message: 'recruiter profile is not yet set or not yet created.'})
                                    else resolve(recruiterprofile)
                                })
                        })
                    }
                })
                .then(recruiterprofile => resolve(recruiterprofile))
                .catch(error => reject({ message: error.message }))
        })
    },
    search: async({ filter, pageSize, pageNum, orderBy }) =>  {
        try {
            const totalItems = await RecruiterProfileModel.find(filter)

            let searchItems = []
            const offset = (pageNum - 1) * pageSize
            if(orderBy !== orderBy) {
                searchItems = await RecruiterProfileModel.find(filter).skip(offset).limit(pageSize).sort(orderBy)
            } else {
                searchItems = await RecruiterProfileModel.find(filter).skip(offset).limit(pageSize)
            }

            const items = []
            searchItems.forEach(item => {
                items.push({
                    _id: item.recruiter,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    location: item.location,
                    displayPicture: item.displayPicture,
                    jobTitle: item.jobTitle,               
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
            
            const recruiterResult = await RecruiterModel.findOne({ recruiterName: name })
            
            if(!recruiterResult) throw new Error('Recruiter profile not found with name of ' + name + '.')

            const recruiterProfile = await RecruiterProfileModel.findOne({ recruiter: recruiterResult._id, privateCode: code })

            if(!recruiterProfile) throw new Error('Recruiter profile not found with name of ' + name + '.')

            return {
                firstName: recruiterProfile.firstName,
                lastName: recruiterProfile.lastName,
                jobTitle: recruiterProfile.jobTitle,
                location: recruiterProfile.location,
                premium: recruiterProfile.premium,
                videoUrl: recruiterProfile.videoUrl,
                aboutMe: recruiterProfile.aboutMe,
                socialLinks: recruiterProfile.socialLinks,
                displayPicture: recruiterProfile.displayPicture
            }
        } catch(err) {
            throw new Error(err.message)
        }
    }
}