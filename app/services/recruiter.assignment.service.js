const { v4 } = require('uuid')

module.exports = RecruiterAssignmentService = {
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
    fetchAllRecruiters: async({ pageSize, pageNum, orderBy }) =>  {
        try {
            const totalItems = await RecruiterProfileModel.find()

            let searchItems = []
            const offset = (pageNum - 1) * pageSize
            if(orderBy !== orderBy) {
                searchItems = await RecruiterProfileModel.find().skip(offset).limit(pageSize).sort(orderBy)
            } else {
                searchItems = await RecruiterProfileModel.find().skip(offset).limit(pageSize)
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
    searchRecruiters: async({ filter, pageSize, pageNum, orderBy }) =>  {
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
                Message: 'Successfully retrieve records.',
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