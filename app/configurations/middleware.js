const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

module.exports  = function(){
    this.use(fileUpload({
        createParentPath: true
    }))

    this.use(bodyParser.json())
    this.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

    this.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
        res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")
        next()
    })
}
