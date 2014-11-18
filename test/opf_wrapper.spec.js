var opf = require('../index.js');
var should = require('should');
var fs = require('fs')
describe('after loading meta.opf', function () {
    var opf_data;
    before(function (done) {
        fs.readFile( __dirname+'/files/meta.opf', function(err, data) {
            opf.load(data)
                .then(function(_opf_data){
                    opf_data = _opf_data;
                })
                .then(done,done)
        });
    });
    it('should read title', function () {
        opf_data.title.should.eql("Meta")
    });
    it('should read uuid', function(){
        opf_data.uuid.should.eql("84a4a81b-fdec-4a3c-9e5f-8abd2db8c683")
    })
    it('should read identifiers', function(){
        opf_data.identifiers.should.eql({ 'CALIBRE': { scheme: 'calibre', value: '1046', id: 'calibre_id' },
            'MOBI-ASIN': { scheme: 'MOBI-ASIN', value: 'B00GCICW6O', id: undefined } })
    })
    //Wrapper.prototype.read_creator = function(file_as){}; //if file_as is empty, return all;
    it('should read creators',function(){
        opf_data.creators.should.eql([{ "file-as": 'Reynolds, Tom', value: 'Reynolds, Tom', role: 'aut' }])
    })
    it('should read contributors',function(){
        opf_data.contributors.should.eql([{ 'file-as': 'calibre', value: 'calibre (1.5.0) [http://calibre-ebook.com]', role: 'bkp' }])
    })
    it('should read date',function(){
        opf_data.date.should.eql('2013-10-26T18:30:00+00:00');
    })
    it('should read description ',function(){
        opf_data.description.should.eql('It’s been ten years since Connor Connolly lost his parents in ‘The Battle’; a fight between The Governor and Jones, two of the world’s strongest metas. Before ‘The Battle’ the world had been full of metas, super-powered humans whose amazing abilities came from mysterious wristbands. Since that day one has never been seen again.');
    })
    it('should read metadata',function(){
        opf_data.metadata.should.eql({ 'calibre:author_link_map': '{"Reynolds, Tom": ""}',
            'calibre:timestamp': '2013-11-24T02:04:04.348000+00:00',
            'calibre:title_sort': 'Meta' } );
    })
});

describe('after loading rithmatist.opf', function () {
    var opf_data;
    before(function (done) {
        fs.readFile( __dirname+'/files/rithmatist.opf', function(err, data) {
            opf.load(data)
                .then(function(_opf_data){
                    opf_data = _opf_data;
                })
                .then(done,done)
        });
    });

    it('should read subjects',function(){
        opf_data.subjects.should.eql(['Juvenile Fiction','Fantasy & Magic']);
    })
});


describe('after loading prince_of_thorns.opf', function () {
    var opf_data;
    before(function (done) {
        fs.readFile( __dirname+'/files/prince_of_thorns.opf', function(err, data) {
            opf.load(data)
                .then(function(_opf_data){
                    opf_data = _opf_data;
                })
                .then(done,done)
        });
    });

    it('should read title', function () {
        opf_data.title.should.eql("Prince of Thorns")
    });
    it('should read uuid', function(){
        opf_data.uuid.should.eql("c438f2f9-634b-44f6-85e3-96847d4ab448")
    })
    it('should read identifiers', function(){
        opf_data.identifiers.should.eql({ CALIBRE: { scheme: 'calibre', value: '30', id: 'calibre_id' }})
    })
    //Wrapper.prototype.read_creator = function(file_as){}; //if file_as is empty, return all;
    it('should read creators',function(){
        opf_data.creators.should.eql([{ "file-as": 'Lawrence, Mark', value: 'Lawrence, Mark', role: 'aut' }])
    })
    it('should read contributor',function(){
        opf_data.contributors.should.eql([{ 'file-as': 'calibre', value: 'calibre (0.8.9) [http://calibre-ebook.com]', role: 'bkp' }])
    })
    it('should read date',function(){
        opf_data.date.should.eql('2011-08-01T16:00:00+00:00');
    })
    it('should read description',function(){
        (opf_data.description == "").should.be.true;
    })
    it('should read metadata',function(){
        opf_data.metadata.should.eql({ 'calibre:author_link_map': '{"Lawrence, Mark": ""}',
            'calibre:timestamp': '2011-08-03T00:50:32+00:00',
            'calibre:title_sort': 'Prince of Thorns' });
    })
});



describe('creating invalid opf using toXML()', function () {
    var opf_data;
    beforeEach(function (done) {
        opf.create()
            .then(function(_opf_data){
                opf_data = _opf_data;
            })
            .then(done,done)
    });

    /*
     <?xml version="1.0" encoding="UTF-8" ?>
     <package xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" unique-identifier="db-id" version="3.0">

     <metadata>
     <dc:title id="t1">Title</dc:title>
     <dc:identifier id="db-id">isbn</dc:identifier>
     <meta property="dcterms:modified">2014-03-27T09:14:09Z</meta>
     <dc:language>en</dc:language>
     </metadata>
     </package>
    * */

    it('should raise an error if missing title', function () {
        should(function(){opf_data.toXML()}).throw();
    });

    it('should raise an error if missing uuid', function(){
        opf_data.title = "Test title"
        should(function(){opf_data.toXML()}).throw();
    })
    it('should raise an error if missing language', function(){
        opf_data.title = "Test title"
        opf_data.identifiers['UUID_ID'] = {'scheme':"","value":"12345","id":"uuid_id"};
        opf_data.languages = []
        should(function(){opf_data.toXML()}).throw();
    })
});

describe('creating a opf with minimal data using toXML()', function () {
    var opf_data;
    beforeEach(function (done) {
        opf.create()
            .then(function(_opf_data){
                opf_data = _opf_data;
                opf_data.title = "Test title";
                opf_data.uuid = "12345";
                opf_data.date ="2014-08-22T00:41:48.908Z"
            })
            .then(done,done)
    });

    /*
     <?xml version="1.0" encoding="UTF-8" ?>
     <package xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" unique-identifier="db-id" version="3.0">

     <metadata>
     <dc:title id="t1">Title</dc:title>
     <dc:identifier id="db-id">isbn</dc:identifier>
     <meta property="dcterms:modified">2014-03-27T09:14:09Z</meta>
     <dc:language>en</dc:language>
     </metadata>
     </package>
     * */

    it('should have a title', function(){
        opf_data.title.should.eql("Test title");
    })

    it('should have a uuid', function(){
        opf_data.uuid.should.eql("12345");
    })

    it('should generate valid opf file', function () {
        opf_data.toXML().should.eql("<?xml version=\"1.0\"?><package xmlns=\"http://www.idpf.org/2007/opf\" unique-identifier=\"uuid_id\"><metadata xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:opf=\"http://www.idpf.org/2007/opf\"><dc:identifier opf:scheme=\"uuid\" id=\"uuid_id\">12345</dc:identifier><dc:title>Test title</dc:title><dc:language>en</dc:language><dc:date>2014-08-22T00:41:48.908Z</dc:date></metadata></package>");
    });
});


describe('creating a opf file using toXML()', function () {
    var opf_data;
    beforeEach(function (done) {
        opf.create()
            .then(function(_opf_data){
                opf_data = _opf_data;
                opf_data.title = "Test title"
                opf_data.uuid ="12345";
                opf_data.date ="2014-08-22T00:41:48.908Z"

            })
            .then(done,done)
    });
    it('should generate valid opf file', function () {
        opf_data.toXML().should.eql("<?xml version=\"1.0\"?><package xmlns=\"http://www.idpf.org/2007/opf\" unique-identifier=\"uuid_id\"><metadata xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:opf=\"http://www.idpf.org/2007/opf\"><dc:identifier opf:scheme=\"uuid\" id=\"uuid_id\">12345</dc:identifier><dc:title>Test title</dc:title><dc:language>en</dc:language><dc:date>2014-08-22T00:41:48.908Z</dc:date></metadata></package>");
    });
});


describe('creating a opf file and generate sha1', function () {
    var opf_data;
    beforeEach(function (done) {
        opf.create()
            .then(function(_opf_data){
                opf_data = _opf_data;
                opf_data.title = "Test title"
                opf_data.identifiers['ISBN'] = {"id":"ISBN",'scheme':"","value":"1234567890"};
                opf_data.identifiers['UUID_ID'] = {'scheme':"","value":"12345","id":"uuid_id"};
                opf_data.date ="2014-08-22T00:41:48.908Z"

            })
            .then(done,done)
    });
    it('should generate valid opf file', function () {
        opf_data.sha1().should.eql("da9ebcfb1385f0244c0dba8b33cbf1851f11e8f3");
    });
});

describe('creating a reordered opf file and generate sha1', function () {
    var opf_data;
    beforeEach(function (done) {
        opf.create()
            .then(function(_opf_data){
                opf_data = _opf_data;
                opf_data.uuid = "12345";
                opf_data.identifiers['ISBN'] = {"id":"ISBN",'scheme':"","value":"1234567890"};
                opf_data.date ="2014-08-22T00:41:48.908Z"
                opf_data.title = "Test title"


            })
            .then(done,done)
    });
    it('should generate valid opf file', function () {
        opf_data.sha1().should.eql("da9ebcfb1385f0244c0dba8b33cbf1851f11e8f3");
    });
});