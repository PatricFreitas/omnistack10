const validator = require('validator')

module.exports = function stringEmptyOrUndefined(string){
    return string && validator.isEmpty(string);
}