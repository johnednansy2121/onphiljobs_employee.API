const { basePath } = require('./apiConfig');
const Response = require(basedir + '/helpers/responseMiddleware');

module.exports = function() {
    const baseRoute = basePath + 'wordpress'

    //list all posts
    this.get(baseRoute + '/getposts', (req, res) => {
        return new Promise((resolve, reject) => {
            WordpressService.getposts()
                .then(wppostdata => resolve(res.json(Response.Success.Custom('Succssfully listed wordpress posts', wppostdata))))
                .catch(error => reject(Response.Error.Custom(res, error)))
        })
    })

    //get all posts in a category
    this.get(baseRoute + '/getposts/:category', (req, res) => {
        return new Promise((resolve, reject) => {
            const pageNumber = req.query.page != undefined && req.query.page != '' && req.query.page != null ? req.query.page : 1
            WordpressService.getpostincategory(req.params.category, pageNumber)
                .then(wppostdata => resolve(res.json(Response.Success.Custom('Succssfully listed wordpress posts', wppostdata))))
                .catch(error => reject(Response.Error.Custom(res, error)))
        })
    })

    //get specific post
    this.get(baseRoute + '/getpost/:slug', (req, res) => {
        return new Promise((resolve, reject) => {
            const slug = req.params.slug;
            WordpressService.getpost(slug)
                .then(wppostdata => resolve(res.json(Response.Success.Custom('Succssfully got wordpress post', wppostdata))))
                .catch(error => reject(Response.Error.Custom(res, error)))
        })
    })

    //list all categories
    this.get(baseRoute + '/categories', (req, res) => {
        return new Promise((resolve, reject) => {
            WordpressService.categories()
                .then(wppostdata => resolve(res.json(Response.Success.Custom('Succssfully listed wordpress categories', wppostdata))))
                .catch(error => reject(Response.Error.Custom(res, error)))
        })
    })

}
