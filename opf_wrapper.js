var _ = require('lodash');
var xml2js = require('xml2js');

function parse_opf_file(wrapper, json_content){
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Parse OPF file.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var self = wrapper;
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
    self.uuid = uuid['_'];

    //Identifiers (includes the UUID)
    self.identifiers = _.reduce(json_content.package.metadata[0][self._dcns +":identifier"] || [],function (prev, identifier){
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
        self.title = title_node[0]
    }

    //Creator
    self.creators = _.map(json_content.package.metadata[0][self._dcns +":creator"] || [],function (found_creator){
        var data = {};
        data['file-as'] = found_creator['$'][self._opfns+':file-as'];
        data['value'] = found_creator['_'];
        data['role'] = found_creator['$'][self._opfns+':role'];
        return data;
    })

    //Contributor
    self.contributors = _.map(json_content.package.metadata[0][self._dcns +":contributor"] || [],function (contributor){
        var data = {};
        data['file-as'] = contributor['$'][self._opfns+':file-as'];
        data['value'] = contributor['_'];
        data['role'] = contributor['$'][self._opfns+':role'];
        return data;
    })

    //Date
    var date_node = json_content.package.metadata[0][self._dcns +":date"]
    if(date_node && date_node[0]){
        self.date = date_node[0]
    }

    //Description
    var description_node = json_content.package.metadata[0][self._dcns +":description"]
    if(description_node && description_node[0]){
        self.description = description_node[0]
    }

    //Subjects
    self.subjects = json_content.package.metadata[0][self._dcns +":subject"] || [];

    //Meta
    self.metadata = _.reduce(json_content.package.metadata[0]['meta'] || [],function (prev,meta){
        prev[meta['$']['name']] = meta['$']['content'];
        return prev;
    },{})

    //Publisher
    self.publishers = json_content.package.metadata[0][self._dcns +":publisher"] || [];

    //TODO: add type

    //TODO: add format

    //TODO: add source

    //TODO: add relation

    //TODO: add coverage

    //TODO: add rights

    //TODO: add publisher

    //TODO: add languages

    //TODO: add guides
}


var Wrapper = function(json_content){
    this._dcns = 'dc';
    this._opfns = 'opf'
    this._unique_identifier_id = "uuid_id";

    //Set sane defaults.
    this.uuid = '';
    this.identifiers = {};
    this.title = '';
    this.creators = [];
    this.contributors = [];
    this.date = (new Date()).toISOString();
    this.description = "";
    this.subjects = [];
    this.metadata = {};

    this.languages = ["en"];

    if(!json_content) return;
    this._unique_identifier_id = json_content.package['$']['unique-identifier'];

    parse_opf_file(this, json_content);
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
Wrapper.prototype.sha1 = function(options){
    var crypto = require('crypto');
    var self = this;

    //https://coderwall.com/p/u2nc8w/deterministic-json-stringify
    function stringify(obj) {
        function flatten(obj) {
            if (_.isObject(obj)) {
                return _.sortBy(_.map(
                        _.pairs(obj),
                        function(p) { return [p[0], flatten(p[1])]; }
                    ),
                    function(p) { return p[0]; }
                );
            }
            return obj;
        }
        return JSON.stringify(flatten(obj));
    }

    options = options || {whitelist :[]};

    var sha_obj = {};
    var props = Object.getOwnPropertyNames(self);
    for(var ndx in props){
        var property = props[ndx];
        if(!options.whitelist.length || options.whitelist.indexOf(property) != "-1"){
            sha_obj[property] = self[property];
        }
    }

    var shasum = crypto.createHash('sha1');
    var json_string = stringify(sha_obj)
    shasum.update(json_string);
    console.log("SHA1 of JSON=====================================================================================",json_string)
    return shasum.digest('hex');

}

Wrapper.prototype.toXML = function(options){
    var self = this;

    var builder = require('xmlbuilder');
    var package = builder.create({'package': {'@xmlns':"http://www.idpf.org/2007/opf", "@unique-identifier":self._unique_identifier_id }});
    var metadata_attributes = {};
    metadata_attributes["xmlns:"+self._dcns] = "http://purl.org/dc/elements/1.1/";
    metadata_attributes["xmlns:"+self._opfns] = "http://www.idpf.org/2007/opf";

    var metadata = package.ele('metadata', metadata_attributes);
    //<dc:identifier opf:scheme="calibre" id="calibre_id">30</dc:identifier>
    if(!self.identifiers[self._unique_identifier_id.toUpperCase()]){
        console.log("IDENTIFIER REQ");
        throw new Error('UUID Identifier is required');
    }
    _.forEach(self.identifiers, function(identifier, key){

        var attrs = {'opf:scheme':identifier.scheme};
        if(identifier.id){
            attrs['id'] = identifier.id;
        }
        metadata.ele('dc:identifier',attrs, identifier.value)
    })

    //<dc:title>Prince of Thorns</dc:title>
    if(!self.title){
        console.log("TITLE REQ")
        throw new Error('Title is required')
    }
    metadata.ele('dc:title',{}, self.title)

    //<dc:language>en</dc:language>
    if(_.size(self.languages) == 0){
        console.log("LANGUAGE REQUIRED")
        throw new Error("At least one language is required");
    }
    _.forEach(self.languages, function(lang){
        metadata.ele('dc:language',{}, lang)
    })

    //<dc:creator opf:file-as="Lawrence, Mark" opf:role="aut">Lawrence, Mark</dc:creator>
    _.forEach(self.creators, function(creator){
        metadata.ele('dc:creator',{'opf:file-as':creator['file-as']||creator.value,'opf:role':creator['role']|| 'aut'},creator.value)
    })

    //<dc:contributor opf:file-as="calibre" opf:role="bkp">calibre (0.8.9) [http://calibre-ebook.com]</dc:contributor>
    _.forEach(self.contributors, function(contributor){
        metadata.ele('dc:contributor',{'opf:file-as':contributor['file-as'],'opf:role':contributor['role']},contributor.value)
    })

    //<dc:date>2013-05-13T23:00:00+00:00</dc:date>
    //TODO: validate that date is a string type.
    metadata.ele('dc:date',{}, self.date);

    //<dc:description>&lt;div&gt;&lt;p&gt;From #1 &lt;em&gt;New York Times&lt;/em&gt; bestselling author Brandon Sanderson:...</dc:description>
    if(self.description) metadata.ele('dc:description',{},self.description);

    //<dc:publisher>Tor Teen</dc:publisher>
    _.forEach(self.publisher, function(publisher){
        metadata.ele('dc:publisher',{},publisher)
    })

    //<dc:subject>Juvenile Fiction</dc:subject>
    _.forEach(self.subjects, function(subject){
        metadata.ele('dc:subject',{},subject)
    })

    //<meta content="{&quot;Brandon Sanderson&quot;: &quot;&quot;}" name="calibre:author_link_map"/>
    _.forEach(self.metadata, function(meta_content, meta_name){
        metadata.ele('meta',{content:meta_content, name:meta_name})
    })




    var xml = package.end(options||{});//{ pretty: true}
    return xml;
};


module.exports = Wrapper;