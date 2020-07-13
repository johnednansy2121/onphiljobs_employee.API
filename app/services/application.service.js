module.exports = ApplicationService = {
    search: async({ filter, orderyBy, pageNum, pageSize },{ _id }) => {
        try {
            
            const totalItems = await ApplicationModel.find({ applicant: _id })

            let searchItems = []

            const offset = (pageNum - 1) * pageSize

            if(orderyBy !== null) {
                searchItems = await ApplicationModel.find({ applicant: _id }).populate('job').sort(orderyBy).skip(offset).limit(pageSize)
            } else {
                searchItems = await ApplicationModel.find({ applicant: _id }).populate('job').skip(offset).limit(pageSize)
            }   

            const items = []

            searchItems.forEach(item => {
                items.push({
                    _id: item._id,
                    job: {
                        _id: item.job._id,
                        title: item.job.title,
                        subtitle: item.job.subtitle,
                        premium: item.job.premium.isFeatured,
                        metadata: {
                            publishDate: item.job.metadata.publishDate
                        }
                    },
                    status: item.status,
                    metadata: {
                        ...item.metadata
                    }
                })
            })
        
            return {
                items,
                totalItems: totalItems.length,
                pageNum,
                pageSize,
                message: 'successfully retrieve records.',
                successful: true
            }
            
        } catch(err) {
            throw new Error(err.message)
        }
    },
    withdraw: async(applicationId, { _id }) => {
        try {
            const applicationDetails = await ApplicationModel.findOne({ _id: applicationId, applicant: _id })

            if(!applicationDetails) throw new Error('Application not found with id of ' + applicationId)

            await ApplicationModel.update({ _id: applicationId }, {
                $set: {
                    status: 'WITHDRAWN',
                    metadata: {
                        dateUpdated: new Date()
                    }
                }
            })

            const updatedApplication = await ApplicationModel.findById(applicationId).populate('job')

            return {
                _id: updatedApplication._id,
                job: {
                    _id: updatedApplication.job._id,
                    title: updatedApplication.job.title,
                    subtitle: updatedApplication.job.subtitle,
                    premium: updatedApplication.job.premium.isFeatured,
                    metadata: {
                        publishDate: updatedApplication.job.metadata.publishDate
                    }
                },
                status: updatedApplication.status,
                metadata: {
                    ...updatedApplication.metadata
                }
            }
        } catch(err) {
            throw new Error(err.message)
        }
    }
}