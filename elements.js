exports.identifier = function(scheme, value, id){
    var data = {};
    data['scheme'] = scheme;
    data['value'] = value;
    data['id'] = id;
    return data;
}

exports.creator = function(file_as, value, role){
    var data = {};
    data['file-as'] = file_as;
    data['value'] = value;
    data['role'] = role;
    return data;
}

exports.contributor = function(file_as, value, role){
    var data = {};
    data['file-as'] = file_as;
    data['value'] = value,
    data['role'] = role;
    return data;
}