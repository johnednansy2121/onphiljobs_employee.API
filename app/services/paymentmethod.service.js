const { STRIPE_API_KEY } = require(basedir + '/configurations/configuration')
const stripe = require('stripe')(STRIPE_API_KEY)

module.exports = PaymentMethodService = {
    create: (data, user) => {
        return new Promise((resolve, reject) => {
            const { cardNumber, expiryMonth, expiryYear, cvc, address1, address2, city, state, postalCode, accountName } = data
            let paymentMethod
            let customer
            stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: cardNumber,
                    exp_month: expiryMonth,
                    exp_year: expiryYear,
                    cvc
                }
            }, (err, paymentMethodRes) => {
                if(err) reject({ message: err })
                else {
                    paymentMethod = paymentMethodRes
                    UserModel.findOne({ _id: user._id })
                        .then(userRes => {
                            const { email } = userRes
                            stripe.customers.create({
                                address: {
                                    line1: address1,
                                    city,
                                    state,
                                    line2: address2,
                                    postal_code: postalCode
                                },
                                name: accountName,
                                email,
                                payment_method: paymentMethod.id,
                                invoice_settings: {
                                    default_payment_method: paymentMethod.id
                                }
                            }, (err1, customerRes) => {
                                if(err1) reject({ message: err1})
                                else {
                                    customer = customerRes
        
                                    PaymentMethodModel.create({
                                        stripeCustomerId: customer.id,
                                        stripePaymentMethodId: paymentMethod.id,
                                        last4digit: paymentMethod.card.last4,
                                        cardType: paymentMethod.card.brand,
                                        metadata: {
                                            owner: user._id,
                                            dateCreated: new Date()
                                        }
                                    })
                                    .then(createRes => resolve(createRes))
                                    .catch(err => reject({ message: err.message }))
                                }
                            })
                        })
                        .catch(err => reject({ message: err.message }))
                    
                }
            })
        })
    },
    getall: (user) => {
        return new Promise((resolve, reject) => {
            PaymentMethodModel.find({'metadata.owner': user._id})
            .then(result => resolve(result))
            .catch(err => reject({ message: err.message }))
        })
    },
    update: (data, user) => new Promise((resolve, reject) => {
        const { cardNumber, expiryMonth, expiryYear, cvc } = data
        console.log(data)
        PaymentMethodModel.findOne({ _id: data._id, 'metadata.owner': user._id })
            .then(paymentMethodRes => {
                if(!paymentMethodRes) reject({ message: 'Payment method not found.' })
                else {
                    stripe.paymentMethods.create(
                        {
                          type: 'card',
                          card: {
                            number: cardNumber,
                            exp_month: expiryMonth,
                            exp_year: expiryYear,
                            cvc
                          },
                        },
                        (err, newPaymentMethod)  => {
                          if(err) reject({ message: err.message })
                          else {
                              const { card: { last4, brand }, id} = newPaymentMethod

                              PaymentMethodModel.updateOne({ _id: data._id }, {
                                  $set: {
                                      last4digit: last4,
                                      cardType: brand,
                                      stripePaymentMethodId: id,
                                      'metadata.dateUpdated': new Date()
                                  }
                              }).then(() => {
                                PaymentMethodModel.findById(data._id)
                                    .then(updatePaymentMethod => resolve(updatePaymentMethod))
                                    .catch(err => reject({ message: err.message }))
                              })
                              .catch(err => reject({ message: err.message }))
                          }
                        }
                      )
                }
            })
            .catch(err => reject({ message: err.message }))
    })
}