var _ = require('lodash');
var xml2js = require('xml2js');
var Wrapper = function(json_content){
    this._dcns = 'dc';
    this._opfns = 'opf'
    this._unique_identifier_id = json_content.package['$']['unique-identifier'];

    if(!json_content) return;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Parse OPF file.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var self = this;
    //UUID;
    var uuid = _.find(json_content.package.metadata[0][self._dcns +":identifier"] || [],function(identifier){
        if (identifier['$']['id'] == self._unique_identifier_id){
            return identifier;
        }
        else{
            return false;
        }
    })
    if(!uuid){
        throw new Error("Invalid OPF file, UUID is required");
    }
    this.uuid = uuid['_'];

    //Identifiers
    this.identifiers = _.reduce(json_content.package.metadata[0][self._dcns +":identifier"] || [],function (prev, identifier){
        var data = {};
        data['scheme'] = identifier['$'][self._opfns+':scheme'];
        data['value'] = identifier['_'];
        data['id'] = identifier['$']['id'];
        prev[data['scheme'].toUpperCase()] = data;
        return prev;
    },{})

    //Title
    var title_node = json_content.package.metadata[0][self._dcns +":title"];
    if(title_node && title_node[0]){
        this.title = title_node[0]
    }
    else{
        this.title = "";
    }

    //Creator
    this.creators = _.map(json_content.package.metadata[0][self._dcns +":creator"] || [],function (found_creator){
        var data = {};
        data['file-as'] = found_creator['$'][self._opfns+':file-as'];
        data['value'] = found_creator['_'];
        data['role'] = found_creator['$'][self._opfns+':role'];
        return data;
    })

    //Contributor
    this.contributors = _.map(json_content.package.metadata[0][self._dcns +":contributor"] || [],function (contributor){
        var data = {};
        data['file-as'] = contributor['$'][self._opfns+':file-as'];
        data['value'] = contributor['_'];
        data['role'] = contributor['$'][self._opfns+':role'];
        return data;
    })

    //Date
    var date_node = json_content.package.metadata[0][self._dcns +":date"]
    if(date_node && date_node[0]){
        this.date = date_node[0]
    }
    else{
        this.date = (new Date()).toISOString();
    }

    //Description
    var description_node = json_content.package.metadata[0][self._dcns +":description"]
    if(description_node && description_node[0]){
        this.description = description_node[0]
    }
    else{
        this.description = ""
    }

    //Subjects
    this.subjects = json_content.package.metadata[0][self._dcns +":subject"] || [];

    //Meta
    this.metadata = _.reduce(json_content.package.metadata[0]['meta'] || [],function (prev,meta){
        prev[meta['$']['name']] = meta['$']['content'];
        return prev;
    },{})
}

/*
* SETTERS AND GETTERS?
*
* Object.defineProperty(Wrapper.prototype, "title", {
    get: function() {
        return this._title;
    }
  });
* */


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utilities
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.toXML = function(){
    var builder = new xml2js.Builder();
    return builder.buildObject({});
};


module.exports = Wrapper;