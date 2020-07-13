const axios = require('axios').default

module.exports = UtilityService = {
    getCountries: () => new Promise((resolve, reject) => {
        axios.get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                resolve(response.data.map(x => x.name))
            })
    })
}