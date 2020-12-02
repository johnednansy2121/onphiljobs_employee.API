module.exports = JobInviteService = {
    invite: async({ filter, orderyBy, pageNum, pageSize }, { lat, long, distance }) => {
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
    }
}