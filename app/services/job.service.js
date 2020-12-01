module.exports = JobService = {
    search: async({ filter, orderyBy, pageNum, pageSize }, { lat, long, distance }) => {
        try {
            await JobModel.createIndexes({ 'geoLocation': '2dsphere' })
            let jobIdsWithinArea = []
            if((lat !== undefined && lat !== undefined) && (long !== undefined && long !== null) && (distance !== undefined && distance !== null)) {
                const jobsWithinArea = await JobModel.find({
                    geoLocation: {
                        $geoWithin: {
                            $centerSphere: [[long, lat], distance/3963.2 ]
                        }
                    }
                })
                jobIdsWithinArea = jobsWithinArea.map(x => x._id)
            }
            filter['status'] = 'PUBLISHED'
            let totalItems = []
            if(jobIdsWithinArea.length > 0) {
                filter['_id'] = { $in: jobIdsWithinArea }
            } 
            totalItems = await JobModel.find(filter)
            const offset = (pageNum - 1) * pageSize
            let searchItems = []
            if(orderyBy !== null) {
                searchItems = await JobModel.find(filter).populate('metadata.organization').sort(orderyBy).skip(offset).limit(pageSize)
            } else {
                searchItems = await JobModel.find(filter).populate('metadata.organization').skip(offset).limit(pageSize)
            }
            const list = []
            searchItems.forEach(item => {
                list.push({
                    _id: item._id,
                    title: item.title,
                    subtitle: item.subtitle,
                    section: item.section,
                    location: item.details.location,
                    isFeatured: item.premium.isFeatured,
                    metadata: {
                        publishedDate: item.metadata.publishDate,
                        organization: item.metadata.organization.name
                    }
                })
            })
            return {
                items: list,
                totalItems: totalItems.length,
                pageSize: pageSize,
                pageNum: pageNum,
                message: 'Successfully retrieve records.',
                successful: true
            }
        } catch(err) {
            throw new Error(err.message)
        }
    },
    getById: async(id) => {
        try {
            const jobDetails = await JobModel.findOne({ _id: id, status: 'PUBLISHED' }).populate('metadata.organization')

            if(!jobDetails) throw new Error('Job not found with id of ' + id)

            return {
                model: jobDetails,
                message: 'successfully retrieve record.',
                successful: true
            }
        } catch(err) {
            throw new Error(err.message)
        }
    },
    apply: async(jobId, user) => {
        try {
            const jobDetails = await JobModel.findOne({ _id: jobId, status: 'PUBLISHED' })

            if(!jobDetails) throw new Error('Job not found with id of ' + id)

            const getAppliedJob = await ApplicationModel.find({ job: jobId, applicant: user._id })

            if(getAppliedJob.length >= 1) throw new Error('You have already applied for this job.')

            await ApplicationModel.create({ 
                applicant: user._id,
                job: jobId,
                status: 'SUBMITTED',
                metadata: {
                    dateCreated: new Date()
                }
            })
            return true
        } catch(err) {
            throw new Error(err.message)
        }
    },
    create: async(data, employer) => {
        try {

            const { client, title, subtitle, section, details, status, premium } = data

            const checkEmployer = await EmployerModel.find({ name: employer._id })

            if(checkEmployer.length >= 1) throw new Error('Failed fetching Employer details.')

            const result = await JobModel.create({
                title,
                subtitle,
                section,
                details,
                status,
                premium,
                geoLocation,
                metadata: {
                    client,
                    organization: user.context,
                    createdBy: user.id,
                    dateCreated: new Date(),
                    publishedDate: new Date()
                }
            })
            return result;
        } catch(err) {
            throw new Error(err.message)
        }
    },
    publish: async(jobId, employer) => {
        try {
            const jobResult = await JobModel.findOne({ _id: id, 'metadata.organization': user.context })

            if(!jobResult) throw new Error(`Record not found with id of ${id}`)

            await JobModel.update({ _id: id }, {
                $set: {
                    status: 'PUBLISHED',
                    metadata: {
                        organization: user.context,
                        client: jobResult.metadata.client,
                        createdBy: jobResult.metadata.createdBy,
                        dateCreated: jobResult.metadata.dateCreated,
                        dateUpdated: new Date(),
                        publishDate: new Date()
                    }
                }
            })
    
            return true
        } catch(err) {
            throw new Error(err.message)
        }
    },
    drafts: async(jobId, employer) => {
        try {
            const jobDetails = await JobModel.findOne({ _id: id, 'metadata.organization': user.context })

            if(!jobDetails) throw new Error('Record not found with id of ' + id)

            jobDetails.metadata.dateUpdated = new Date()
            await JobModel.update({ _id: id }, {
                $set: {
                    status: 'DRAFT',
                    metadata: {
                        ...jobDetails.metadata
                    }
                }
            })

            return true
        } catch(err) {
            throw new Error(err.message)
        }
    },
    unlist: async(jobId, employer) => {
        try {
            const jobDetails = await JobModel.findOne({ _id: id, 'metadata.organization': user.context })

            if(!jobDetails) throw new Error('Record not found with id of ' + id)

            jobDetails.metadata.dateUpdated = new Date()
            await JobModel.update({ _id: id }, {
                $set: {
                    status: 'UNLISTED',
                    metadata: {
                        ...jobDetails.metadata
                    }
                }
            })

            return true
        } catch(err) {
            throw new Error(err.message)
        }
    }
}