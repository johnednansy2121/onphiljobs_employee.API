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

module.exports = EmployerProfileService = {
    getMyProfile: async(employer) => {
        try {
            
            const profileRes = await EmployerProfileModel.findOne({ employer: employer._id })
                // .populate({
                //     path: 'premium.subscription',
                //     model: 'subscription'
                // })

            return { 
                successful: profileRes ? true : false,
                model: profileRes,
                message: 'Successfully retrieve record.'
            }
        } catch(err) {
            throw new Error(err.message)
        }
    },
    create: ({ firstName, lastName, aboutMe, displayPicture, videoUrl, socialLinks }, employer) => {
        return new Promise((resolve, reject) => {
            EmployerProfileModel.create({ employer: employer._id, firstName, lastName, aboutMe, displayPicture, videoUrl: getVideoId(videoUrl), socialLinks, privateCode: v4() , metadata: { dateCreated: new Date() }})
                .then(profile => {
                    console.log("PROFILE", profile)
                    return new Promise((resolve, reject) => {
                        EmployerModel.findById(employer._id)
                            .then(employer => {
                                console.log("EMPLOYER", employer)
                                EmployerModel.updateOne({ _id: employer._id },
                                    {
                                        $set: {
                                            metadata: {
                                                dateCreated: employer.metadata.dateCreated,
                                                hasProfile: true,
                                                dateUpdated: new Date(),
                                                verificationToken: employer.metadata.verificationToken
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
    update: async({ _id, firstName, lastName, aboutMe, displayPicture, videoUrl, socialLinks, jobTitle, location }, employer) => {
        try {
            const employerProfile = await EmployerProfileModel.findOne({ employer: employer._id, _id })

            if(!employerProfile) throw new Error('You are updating a profile that does not belong to you.')

            await EmployerProfileModel.updateOne({ _id }, {
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
                        dateCreated: employerProfile.metadata.dateCreated,
                        dateUpdated: new Date()
                    }
                }
            })

            const updateProfile = await EmployerProfileModel.findOne({ _id, employer: employer._id })
                // .populate({
                //     path: 'premium.subscription',
                //     model: 'subscription'
                // })
            
            console.log(updateProfile)
            return updateProfile
        } catch(err) {
            throw new Error(err.message)
        }
    },
    getProfileByEmployerName: (employerName) => {
        return new Promise((resolve, reject) => {
            EmployerModel.findOne({ employerName: employerName})
                .then(employer => {
                    if(!employer) reject({ message: 'employer profile not found with that user name.'})
                    else {
                        return new Promise((resolve, reject) => {
                            EmployerProfileModel.findOne({ employer: employer._id })
                                .then(employerprofile => {
                                    if(!employerprofile) reject({ message: 'employer profile is not yet set or not yet created.'})
                                    else resolve(employerprofile)
                                })
                        })
                    }
                })
                .then(employerprofile => resolve(employerprofile))
                .catch(error => reject({ message: error.message }))
        })
    },
    search: async({ filter, pageSize, pageNum, orderBy }) =>  {
        try {
            const totalItems = await EmployerProfileModel.find(filter)

            let searchItems = []
            const offset = (pageNum - 1) * pageSize
            if(orderBy !== orderBy) {
                searchItems = await EmployerProfileModel.find(filter).skip(offset).limit(pageSize).sort(orderBy)
            } else {
                searchItems = await EmployerProfileModel.find(filter).skip(offset).limit(pageSize)
            }

            const items = []
            searchItems.forEach(item => {
                items.push({
                    _id: item.employer,
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
            
            const employerResult = await EmployerModel.findOne({ employerName: name })
            
            if(!employerResult) throw new Error('Employer profile not found with name of ' + name + '.')

            const employerProfile = await EmployerProfileModel.findOne({ employer: employerResult._id, privateCode: code })

            if(!employerProfile) throw new Error('Employer profile not found with name of ' + name + '.')

            return {
                firstName: employerProfile.firstName,
                lastName: employerProfile.lastName,
                jobTitle: employerProfile.jobTitle,
                location: employerProfile.location,
                premium: employerProfile.premium,
                videoUrl: employerProfile.videoUrl,
                aboutMe: employerProfile.aboutMe,
                socialLinks: employerProfile.socialLinks,
                displayPicture: employerProfile.displayPicture
            }
        } catch(err) {
            throw new Error(err.message)
        }
    }
}