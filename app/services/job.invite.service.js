module.exports = JobInviteService = {
    invite: async( data, user) => {
        try {
            const existingInvite = await ApplicationInviteModel.find({ applicantId: data.applicantId, jobId: data.jobId })

            if(existingInvite.length > 0) throw new Error('Applicant is already invited to the job.')

            const result = await ApplicationInviteModel.create({ applicantId: data.applicantId, jobId: data.jobId, status: 'PENDING', metadata: { 
                user: user.id,
                organization: user.context,
                dateCreated: new Date()
            }})

            return result;
        } catch(err) {
            throw new Error(err.message)
        }
    },
    SearchByJob: async( id, user) => {
        try {
            const inviteSearchItemsResult = await ApplicationInviteModel.find({ jobId, 'metadata.organization': user.context })

            const applicantIds = inviteSearchItemsResult.map(item => item.applicantId)

            const profiles = await FllairUserProfileModel.find({ user: { $in: applicantIds } }).populate('user')

            const list = []

            inviteSearchItemsResult.forEach((item) => {
                const applicantProfile = profiles.filter((profile) => profile.user._id.toString() === item.applicantId.toString())[0]
                
                list.push({
                    _id: item._id,
                    status: item.status,
                    jobId: item.jobId,
                    applicant: {
                        _id: applicantProfile._id,
                        firstName: applicantProfile.firstName,
                        lastName: applicantProfile.lastName,
                        userName: applicantProfile.user.userName,
                        premium: {
                            hasProSubscription: applicantProfile.premium.hasProSubscription
                        }
                    },
                    metadata: {
                        dateCreated: item.metadata.dateCreated,
                        dateUpdated: item.metadata.dateUpdated
                    }
                })
            })

            return list
        } catch(err) {
            throw new Error(err.message)
        }
    }
}