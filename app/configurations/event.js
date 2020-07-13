const { STRIPE_API_KEY } = require('./configuration')
const stripe = require('stripe')(STRIPE_API_KEY)
const EventEmitter = require('events')
const moment = require('moment')

module.exports = MyEventEmitter = new EventEmitter()

module.exports = {
    subscriptionEvent: () => setInterval(async() => {
        const userProfiles = await UserProfileModel.find({ 'premium.subscription': { $ne: null } }).populate({
            path: 'premium.subscription',
            model: 'subscription'
        })
        for(let profile of userProfiles.filter(user => user.premium.subscription.nextInterval <= new Date())) {
            if(profile.premium.subscription.isCancelled) {
                await UserProfileModel.update({ user : profile.user }, {
                    $set: {
                        'premium.hasProSubscription': false,
                        'premium:subscription': null
                    }
                })
            } else {
                const subcriptionData = await stripe.subscriptions.retrieve(profile.premium.subscription.subscriptionId)

                const { current_period_end } = subcriptionData

                if(moment.unix(current_period_end).utc() <= new Date()) {
                    await UserProfileModel.update({ user : profile.user }, {
                        $set: {
                            'premium.hasProSubscription': false
                        }
                    })
                } else {
                    await SubscriptionModel.update({ _id: profile.premium.subscription._id }, {
                        $set: {
                            nextInterval: moment.unix(current_period_end).utc() 
                        }
                    })

                    await UserProfileModel.update({ user : profile.user }, {
                        $set: {
                            'premium.hasProSubscription': true
                        }
                    })
                }
            }
        }

    }, 10000)
}
