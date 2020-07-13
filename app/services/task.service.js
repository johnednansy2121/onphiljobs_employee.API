module.exports = TaskService = {
    create: (data, user) => {
        return new Promise((resolve, reject) => {
            const { name, notes, tags, dueDate } = data
            UserTaskModel.create({
                name,
                notes,
                tags,
                dateDue: dueDate,
                metadata: {
                    owner: user._id,
                    dateCreated: new Date()
                }
            })
            .then(result => {
                CalendarService.addEvent({ referenceId: result._id, eventType: 'TASK', owner: user._id, dateStart: dueDate, eventTitle: name })
                UserTaskModel.findById(result._id)
                    .populate('metadata.owner')
                    .then(task => resolve(task))
                    .catch(err => reject({ message: err.message }))
            })
            .catch(err => reject({ message: err.message }))
        })
    },
    getbyid: (id) => {
        return new Promise((resolve, reject) => {
            UserTaskModel.findById(id)
                .then(task => resolve(task))
                .catch(err => reject({ message: err.message }))
        })
    },
    searchmytask: (tags, sort, user) => {
        return new Promise((resolve, reject) => {
            if (tags != null && tags != '') {
                let filterTags = []
                tags.forEach(tag => filterTags.push(new RegExp(tag, 'i')))
                UserTaskModel.find({ tags: { $all : filterTags} , 'metadata.owner': user._id }).sort(sort)
                    .populate('metadata.owner')
                    .then(tasks => resolve(tasks))
                    .catch(err => reject({ message: err.message }))
            } else {
                UserTaskModel.find({ 'metadata.owner': user._id }).sort(sort)
                .populate('metadata.owner')
                .then(tasks => resolve(tasks))
                .catch(err => reject({ message: err.message }))
            }
        })
    },
    update: (data, user) => {
        return new Promise((resolve, reject) => {
            const { _id, name, notes, tags, isCompleted, dueDate } = data
            UserTaskModel.findOne({ _id: _id, 'metadata.owner': user._id })
            .then(task => {
                if(!task) reject({ message: 'You cannot update this task.'})
                else {
                    UserTaskModel.updateOne({ _id: _id }, {
                        $set: {
                            name,
                            notes,
                            tags,
                            isCompleted,
                            dateDue: dueDate,
                            'metadata.dateUpdated': new Date()
                        }
                    })
                    .then(updatedTask => {
                        UserTaskModel.findById(_id)
                        .populate('metadata.owner')
                        .then(task => resolve(task))
                        .catch(err => reject({ message: err.message }))
                    })
                    .catch(err => reject({ message: err.message }))
                }
            })
            .catch(err => reject({ message: err.message }))
        })
    },
    delete: (id, user) => {
        return new Promise((resolve, reject) => {
            UserTaskModel.findOne({ _id: id, 'metadata.owner': user._id })
            .then(task => {
                if(!task) reject({ message: 'You are not authorized to delete this task.' })
                else {
                    CalendarService.delete(task._id)
                    UserTaskModel.remove(task)
                    .then(result => resolve(true))
                    .catch(err => reject({ message: err.message }))
                }
            })
            .catch(err => reject({ message: err.message }))
        })
    },
    markAsCompleteIncomplete: (id, user) => {
        return new Promise((resolve, reject) => {
            UserTaskModel.findOne({ _id: id, 'metadata.owner': user._id })
                .then(task => {
                    if (!task) reject({ message: 'You are not authorized to mark as complete/incomplete this task.' })
                    else {
                        UserTaskModel.updateOne({ _id: id }, {
                            $set: {
                                isCompleted: !task.isCompleted,
                                'metadata.dateUpdated': new Date()
                            }
                        })
                        .then(result => resolve(true))
                        .catch(err => reject({ message: err.message }))
                    }
                })
                .catch(err => reject({ message: err.message }))
        })
    }
}