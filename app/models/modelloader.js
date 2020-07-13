var fs = require('fs');

module.exports = function () {

    var models_path = __dirname
    var model_files = fs.readdirSync(models_path)

    model_files.forEach(function(folder){
        if(folder !== 'modelloader.js') {
            fs.readdirSync(models_path + "/" + folder).forEach(function (file) {
                console.log("Loading Model - " + folder + " / " + file)
                require(models_path + '/' + folder + "/" + file);
            })
        }
    })

}
