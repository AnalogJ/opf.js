var q = require('q')
var xml2js = require('xml2js')
var parseString = xml2js.parseString;

var opf_wrapper = require('./opf_wrapper.js');
exports.load = function(xml_content){
    if(!xml_content){
        return q.reject("invalid or empty opf content")
    }
    var deferred = q.defer();
    parseString(xml_content, function (err, result) {
        if(err){
            return deferred.reject(err);
        }

        else{
            return deferred.resolve(new opf_wrapper(result));
        }
    });
    return deferred.promise;
}