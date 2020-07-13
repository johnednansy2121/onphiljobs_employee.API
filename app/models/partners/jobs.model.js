const { Schema } = require('mongoose')

const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    section: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    geoLocation: {
        type: {
            type: String
        },
        coordinates: {
            type: [Number]
        }
    },
    details: {
        isWorkFromHome: {
            type: Boolean
        },
        location: {
            address1: {
                type: String
            },
            address2: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String
            },
            postalCode: {
                type: String
            },
            country: {
                type: String
            },
            lat: {
                type: Number
            },
            long: {
                type: Number
            }
        },
        salary: {
            base: {
                type: Number,
                default: 0
            },
            upper: {
                type: Number,
                default: 0
            },
            currency: {
                type: String,
                default: 'AUD'
            },
            type: {
                type: String,
                default: 'Hourly'
            }
        },
        commitment: {
            type: {
                type: String,
                default: 'full-time'
            },
            duration: {
                quantity: {
                    type: Number,
                    required: true,
                    default: 3
                },
                unit: {
                    type: String,
                    required: true,
                    default: 'days'
                }
            }
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'category'
        }
    },
    status: {
        type: String,
        default: 'DRAFT'
    },
    premium: {
        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    private: {
        notes: [
            {
                type: Schema.Types.ObjectId
            }
        ]
    },
    metadata: {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'organization'
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'client'
        },
        dateCreated: {
            type: Date,
        },
        dateUpdated: {
            type: Date
        },
        publishDate: {
            type: Date
        }
    }
})


module.exports = JobModel = partnersdb.model('job', JobSchema)