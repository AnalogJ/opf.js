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
            'UUID':{ scheme: 'uuid', value: '84a4a81b-fdec-4a3c-9e5f-8abd2db8c683', id: 'uuid_id' },
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
        opf_data.identifiers.should.eql({ CALIBRE: { scheme: 'calibre', value: '30', id: 'calibre_id' },
            UUID:
            { scheme: 'uuid',
                value: 'c438f2f9-634b-44f6-85e3-96847d4ab448',
                id: 'uuid_id' } })
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