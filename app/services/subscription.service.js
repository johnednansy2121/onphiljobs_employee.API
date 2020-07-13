const { STRIPE_API_KEY, EMAIL_RECIPIENT, NODE_ENVIRONMENT } = require(basedir + '/configurations/configuration')
const stripe = require('stripe')(STRIPE_API_KEY)
const EmailHelper = require(basedir + '/helpers/emailer')
const moment = require('moment')

const sendNotification = (userId) => {
    if(NODE_ENVIRONMENT.toLowerCase() === 'production') {
        UserProfileModel.findOne({ user: userId })
            .populate('user')
            .then(userProfileRes => {
                let payload = {
                    fullName: `${userProfileRes.firstName} ${userProfileRes.lastName}`,
                    email: userProfileRes.user.email,
                    jobTitle: userProfileRes.jobTitle
                }
                EmailHelper.sendEmail('new.premium', payload, { to: EMAIL_RECIPIENT, subject: 'New Premium User'})
            })
    }  
}


module.exports = SubscriptionService = {
    subscribe: async(data, user) => {
        try {
            const { paymentMethodId, planId, promoCode } = data

            const paymentMethod = await PaymentMethodModel.findOne({ _id: paymentMethodId, 'metadata.owner': user._id })

            if(!paymentMethod) throw new Error('No payment method found.')

            const planDetails = await stripe.plans.retrieve(planId)

            const subscription = await stripe.subscriptions.create({
                customer: paymentMethod.stripeCustomerId,
                items: [{ plan: planId }],
                coupon: promoCode
            })
           
            const subscriptionData = await SubscriptionModel.create({
                subscriptionId: subscription.id,
                planId,
                nextInterval: moment.unix(subscription.current_period_end).utc(),
                isCancelled: false,
                metadata: {
                    owner: user._id,
                    dateCreated: new Date()
                }
            })

            await UserProfileModel.update({ user: user._id }, {
                $set: {
                    'premium.hasProSubscription': true,
                    'premium.subscription': subscriptionData._id,
                    'metadata.dateUpdated': new Date()
                }
            })


            const profile = await UserProfileModel.findOne({ user: user._id })
                .populate({
                    path: 'premium.subscription',
                    model: 'subscription'
                })
            sendNotification(user._id)

            return profile
            
        } catch(err) {
            throw new Error(err.message)
        }
    },
    unsubscribe: async(user) => {
        try {
            const userProfile = await UserProfileModel.findOne({ user: user._id })

            if(!userProfile) throw new Error('Profile not found.')

            const { premium: { subscription } } = userProfile

            const subscriptionData = await SubscriptionModel.findOne({ _id: subscription })

            if(!subscriptionData) throw new Error('Subscription not found.')

            await stripe.subscriptions.del(subscriptionData.subscriptionId)

            await SubscriptionModel.update({ _id: subscription }, {
                $set: {
                    isCancelled: true
                }
            })

            const updateProfile = await UserProfileModel.findOne({ user: user._id })
                .populate({
                    path: 'premium.subscription',
                    model: 'subscription'
                })
            return updateProfile

        } catch(err) {
            throw new Error(err.message)
        }
    },
    webhook: async(event) => {
        try {
            switch(event.type) {
                case 'invoice.payment_succeeded':
                    const invoice = event.data.object

                    const { customer } = invoice
                    
                    const paymentMethod = await PaymentMethodModel.findOne({ stripeCustomerId: customer })

                    if(!paymentMethod) throw new Error('Could not found customer.')

                    const userProfile = await UserProfileModel.findOne({ user: paymentMethod.metadata.owner })

                    const subscription = await SubscriptionModel.findOne({ _id: userProfile.premium.subscription  })

                    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.subscriptionId)

                    await SubscriptionModel.update({ _id: subscription._id }, {
                        $set: {
                            nextInterval: moment.unix(stripeSubscription.current_period_end).utc()
                        }
                    })
                    
                    break;
                default: 
                    break;
            }

            return true
            
        } catch(err) {
            throw new Error(err.message)
        }
    }
}