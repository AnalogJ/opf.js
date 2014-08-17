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

exports.create = function(title, author, lang){
    //title author and lang are the minimum requried fields for a valid opf file.
    var uuid =  require('node-uuid');
    var empty_opf = { package:
    { '$':
    { xmlns: 'http://www.idpf.org/2007/opf',
        'unique-identifier': 'uuid_id' },
        metadata:
            [ { '$':
            { 'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
                'xmlns:opf': 'http://www.idpf.org/2007/opf' },
                'dc:identifier':
                    [ { _: uuid.v1(), '$': { 'opf:scheme': 'uuid', id: 'uuid_id' } } ],
                'dc:title': [ title ],
                'dc:creator':
                    [ { _: author,
                        '$': { 'opf:file-as': author, 'opf:role': 'aut' } } ],
//                'dc:contributor':
//                    [ { _: 'calibre (1.5.0) [http://calibre-ebook.com]', '$': { 'opf:file-as': 'calibre', 'opf:role': 'bkp' } } ],
                'dc:date': [ (new Date()).toISOString() ],
//                'dc:description': [ 'It’s been ten years since Connor Connolly lost his parents in ‘The Battle’; a fight between The Governor and Jones, two of the world’s strongest metas. Before ‘The Battle’ the world had been full of metas, super-powered humans whose amazing abilities came from mysterious wristbands. Since that day one has never been seen again.' ],
//                'dc:publisher': [ 'Leonard & Calyer' ],
                'dc:language': [ lang || 'eng' ]
//                meta:
//                    [ { '$':
//                    { content: '{"Reynolds, Tom": ""}',
//                        name: 'calibre:author_link_map' } },
//                        { '$':
//                        { content: '2013-11-24T02:04:04.348000+00:00',
//                            name: 'calibre:timestamp' } },
//                        { '$': { content: 'Meta', name: 'calibre:title_sort' } } ]
            } ]
//        guide:
//            [ { reference:
//                [ { '$':
//                { href: 'Meta - Reynolds, Tom.jpg',
//                    title: 'Cover',
//                    type: 'cover' } } ] } ]
    } }
    return q(new opf_wrapper(empty_opf));
}