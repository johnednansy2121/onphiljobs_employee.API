let samples = [
    {
    _id: '12321321321',
    name: 'sample 1'
    },
    {
    _id: '33321441243',
    name: 'sample 2'
    }
]

module.exports = SampleService = {
    get: () => {
        return new Promise((resolve, reject) => {
            resolve(samples)
        })
    },
    add: (data) => {
        return new Promise((resolve, reject) => {
            samples.push(data)
            resolve(data)
        })
    }
}