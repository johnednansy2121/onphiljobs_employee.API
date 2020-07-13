const Metadata = require(basedir + '/helpers/metadata.js');
const WPAPI = require('wpapi');
// const MELWP = new WPAPI({endpoint: 'http://my.employeelife.com/wp-json'});
const MELWP = new WPAPI({endpoint: 'http://myemployeelife.b-w-hosting.co.uk/fllairblog/wp-json'});

module.exports = WordpressService = {

    getposts: () => {
        return new Promise((resolve, reject) =>{
            MELWP.posts().categories(47).embed()
                .then((data) => {
                    console.log(data)
                    let result = data.map( post => {
                        return {
                            id: post.id,
                            title: post.title,
                            date: post.date,
                            link: post.link,
                            excerpt: post.excerpt,
                            _embedded: post._embedded
                        }
                    })
                    resolve(result)
                })
                .catch(error => reject(error))
        })
    },

    getpostincategory: (category, pageNumber) => {
        return new Promise((resolve, reject) =>{
            MELWP.categories().slug(category)
                .then((cats) => {
                    if(cats.length > 0){
                        MELWP.posts().perPage(10).page(pageNumber).categories(cats[0].id).embed()
                            .then((data) => {
                                let result = data.map( post => {
                                    return {
                                        id: post.id,
                                        slug: post.slug,
                                        title: post.title,
                                        date: post.date,
                                        link: post.link,
                                        excerpt: post.excerpt,
                                        _embedded: post._embedded
                                    }
                                })
                                resolve(result)
                            })
                            .catch((err) => resolve([]))
                    }else{
                        reject("Couldn't find category")
                    }
                })
                .catch((err) => reject(err))
        })
    },

    getpost: (postid) => {
        return new Promise((resolve, reject) =>{
            MELWP.posts().id(postid).embed()
                .then((data) => {
                    resolve(data)
                })
                .catch(error => reject(error))
        })
    },

    categories: () => {
        return new Promise((resolve, reject) =>{
            MELWP.categories().embed()
                .then((data) => {
                    let result = data.map( cat => {
                        return {id: cat.id, name: cat.name}
                    })
                    resolve(result)
                })
                .catch(error => reject(error))
        })
    }
    // create: (owner, insertObject) => {
    //     return new Promise((resolve, reject) => {
    //         // resolve(samples)
    //         let diaryEntry = insertObject;
    //         insertObject.metadata = Metadata.GenerateWithOwner(owner);
    //
    //         return DiaryModel.create(diaryEntry);
    //     })
    // },
    //
    // listall: (owner) => {
    //     return new Promise((resolve, reject) => {
    //         DiaryModel.find({"metadata.owner": owner})
    //             .then( data => {
    //                 if (!data) reject("No diary entries returned.");
    //                 resolve(data)
    //             })
    //             .catch(error => reject(error))
    //     })
    // }

};
