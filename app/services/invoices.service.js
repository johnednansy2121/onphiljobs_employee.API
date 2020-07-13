const { STRIPE_API_KEY } = require(basedir + '/configurations/configuration')
const stripe = require('stripe')(STRIPE_API_KEY)

const GetInvoices = (paymentMethods) => new Promise((resolve, reject) => {
    let promises = []
    paymentMethods.forEach(paymentMethod => {
        const { stripeCustomerId } = paymentMethod
        promises.push(stripe.invoices.list({ customer: stripeCustomerId}))
    })
    let invoices = []
    Promise.all(promises).then(results => {
        results.forEach(result => {
            result.data.forEach(data => {
                const { id, amount_due, amount_paid, currency, customer_name, status, invoice_pdf } = data
                invoices.push({ id, amountDue: amount_due/100, amountPaid: amount_paid/100, currency, customer_name, status, invoice_pdf })
            })
            // invoices.push(...result.data)
        })
        resolve(invoices)
    })
})


module.exports = InvoiceService = {
    getmyinvoices: (user) => new Promise((resolve, reject) => {
        PaymentMethodModel.find({ 'metadata.owner': user._id })
            .then(paymentMethods => GetInvoices(paymentMethods))
            .then(invoices => resolve(invoices))
            .catch(err => reject({ message: err.message }))
    })
}