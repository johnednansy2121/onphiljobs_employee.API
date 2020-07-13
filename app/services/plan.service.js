const { STRIPE_API_KEY } = require(basedir + '/configurations/configuration')
const stripe = require('stripe')(STRIPE_API_KEY)

module.exports = PlanService = {
    getall: () => {
        return new Promise((resolve, reject) => {
            stripe.plans.list({ limit: 5}, (err, plans) => {
                if(err) reject({ message: err })
                else {
                    resolve(plans.data)
                }
            })
        })
    }
}