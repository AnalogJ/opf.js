var _ = require('lodash');
var Wrapper = function(json_content){
    this.json_content = json_content;
    this.dcns = 'dc';
    this.opfns = 'opf'
    this.unique_identifier_id = this.json_content.package['$']['unique-identifier'];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UUID
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.read_uuid = function(){
    var self = this;
    var identifier = _.find(this.json_content.package.metadata[0][self.dcns +":identifier"] || [],function(identifier){
        if (identifier['$']['id'] == self.unique_identifier_id){
            return identifier;
        }
        else{
            return false;
        }
    })
    return identifier['_']
};
Wrapper.prototype.update_uuid = function(value){};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Identifier
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.create_identifier = function(scheme, value, id){}; //id defaults to empty
Wrapper.prototype.read_identifier = function(scheme){
    var self = this;

    function generate_identifier(identifier){
        var data = {};
        data['scheme'] = identifier['$'][self.opfns+':scheme'];
        data['value'] = identifier['_'];
        data['id'] = identifier['$']['id'];
        return data;
    }

    if(scheme){
        var found_identifier = _.find(this.json_content.package.metadata[0][self.dcns +":identifier"] || [],function(identifier){
            return identifier['$'][self.opfns+':scheme'] == scheme
        })
        if(found_identifier){
            return generate_identifier(found_identifier)
        }
        return null;
    }
    else{
        return _.map(this.json_content.package.metadata[0][self.dcns +":identifier"],generate_identifier)
    }

}; //if scheme is empty, return all;
Wrapper.prototype.update_identifier = function(scheme, value){};
Wrapper.prototype.delete_identifier = function(scheme){};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Title
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.read_title = function(){
    var self = this;
    return this.json_content.package.metadata[0][self.dcns +":title"][0]
};
Wrapper.prototype.update_title = function(value){};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creator
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.create_creator = function(file_as, value, role){};//role is aut by default;
Wrapper.prototype.read_creator = function(file_as){
    var self = this;

    function generate_creator(found_creator){
        var data = {};
        data['file-as'] = found_creator['$'][self.opfns+':file-as'];
        data['value'] = found_creator['_'];
        data['role'] = found_creator['$'][self.opfns+':role'];
        return data;
    }

    if(file_as){
        var found_creator = _.find(this.json_content.package.metadata[0][self.dcns +":creator"] || [],function(creator){
            return creator['$'][self.opfns+':file-as'] == file_as
        })
        if(found_creator){
            return generate_creator(found_creator);
        }
        return null;
    }
    else{
        return _.map(this.json_content.package.metadata[0][self.dcns +":creator"],generate_creator)
    }
}; //if file_as is empty, return all;
Wrapper.prototype.update_creator = function(file_as, value, role){};
Wrapper.prototype.delete_creator = function(file_as){};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Contributor
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.create_contributor = function(file_as, value, role){};//role is aut by default;
Wrapper.prototype.read_contributor = function(file_as){
    var self = this;

    function generate_contributor(contributor){
        var data = {};
        data['file-as'] = contributor['$'][self.opfns+':file-as'];
        data['value'] = contributor['_'];
        data['role'] = contributor['$'][self.opfns+':role'];
        return data;
    }

    if(file_as){
        var found_contributor = _.find(this.json_content.package.metadata[0][self.dcns +":contributor"] || [],function(creator){
            return creator['$'][self.opfns+':file-as'] == file_as
        })
        if(found_contributor){
            return generate_contributor(found_contributor);
        }
        return null;
    }
    else{
        return _.map(this.json_content.package.metadata[0][self.dcns +":contributor"],generate_contributor)
    }
}; //if file_as is empty, return all;
Wrapper.prototype.update_contributor = function(file_as, value, role){};
Wrapper.prototype.delete_contributor = function(file_as){};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Date
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.read_date = function(){
    var self = this;
    var date_elements = self.json_content.package.metadata[0][self.dcns +":date"]
    return date_elements ? date_elements[0]:null;
};
Wrapper.prototype.update_date = function(date){};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Description
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.read_description = function(){
    var self = this;
    var descr_elements = self.json_content.package.metadata[0][self.dcns +":description"]
    return descr_elements? descr_elements[0]:null;
};
Wrapper.prototype.update_description = function(description){};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Subject
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.create_subject = function(value){};//role is aut by default;
Wrapper.prototype.read_subject = function(value){
    var self = this;

    if(value){
        var found_subject = _.find(this.json_content.package.metadata[0][self.dcns +":subject"]|| [],function(subject){
            console.log(subject)
            return subject['$'][self.opfns+':file-as'] == file_as
        })
        if(found_subject){
            return found_subject;
        }
        return null;
    }
    else{
        return this.json_content.package.metadata[0][self.dcns +":subject"] || [];
    }
}; //if file_as is empty, return all;
Wrapper.prototype.update_subject = function(curr_value,updated_value){};
Wrapper.prototype.delete_subject = function(value){};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Content
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.create_meta = function(name,value){};//role is aut by default;
Wrapper.prototype.read_meta = function(name){
    var self = this;
//        <meta content="2013-11-24T02:04:04.348000+00:00" name="calibre:timestamp"/>

    function generate_meta(meta){
        var data = {};
        data['value'] = meta['$']['content'];
        data['name'] = meta['$']['name'];
        return data;
    }

    if(name){
        var found_meta = _.find(this.json_content.package.metadata[0].meta || [],function(meta){
            console.log(meta);
            return meta['$']['name'] == name
        })
        if(found_meta){
            return generate_meta(found_meta);
        }
        return null;
    }
    else{
        return _.map(this.json_content.package.metadata[0]['name'],generate_meta)
    }

}; //if name is empty, return all;
Wrapper.prototype.update_meta = function(name,updated_value){};
Wrapper.prototype.delete_meta = function(name){};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utilities
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Wrapper.prototype.toJSON = function(){return this.json_content;};
Wrapper.prototype.toXML = function(){};


module.exports = Wrapper;