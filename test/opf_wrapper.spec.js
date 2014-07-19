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
    it('should read_title()', function () {
        opf_data.read_title().should.eql("Meta")
    });
    it('should read_uuid()', function(){
        opf_data.read_uuid().should.eql("84a4a81b-fdec-4a3c-9e5f-8abd2db8c683")
    })
    it('should read_identifier()', function(){
        opf_data.read_identifier('calibre').should.eql({ scheme: 'calibre', value: '1046', id: 'calibre_id' })
    })
    //Wrapper.prototype.read_creator = function(file_as){}; //if file_as is empty, return all;
    it('should read_creator()',function(){
        opf_data.read_creator('Reynolds, Tom').should.eql({ "file-as": 'Reynolds, Tom', value: 'Reynolds, Tom', role: 'aut' })
    })
    it('should read_contributor()',function(){
        opf_data.read_contributor('calibre').should.eql({ 'file-as': 'calibre', value: 'calibre (1.5.0) [http://calibre-ebook.com]', role: 'bkp' })
    })
    it('should read_date()',function(){
        opf_data.read_date().should.eql('2013-10-26T18:30:00+00:00');
    })
    it('should read_description()',function(){
        opf_data.read_description().should.eql('It’s been ten years since Connor Connolly lost his parents in ‘The Battle’; a fight between The Governor and Jones, two of the world’s strongest metas. Before ‘The Battle’ the world had been full of metas, super-powered humans whose amazing abilities came from mysterious wristbands. Since that day one has never been seen again.');
    })
    it('should read_meta()',function(){
        opf_data.read_meta('calibre:timestamp').should.eql({ value: '2013-11-24T02:04:04.348000+00:00', name: 'calibre:timestamp' } );
    })
});

describe('after loading meta.opf', function () {
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

    it('should read_subject()',function(){
        opf_data.read_subject().should.eql(['Juvenile Fiction','Fantasy & Magic']);
    })
});


describe('after loading meta.opf', function () {
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

    it('should read_title()', function () {
        opf_data.read_title().should.eql("Prince of Thorns")
    });
    it('should read_uuid()', function(){
        opf_data.read_uuid().should.eql("c438f2f9-634b-44f6-85e3-96847d4ab448")
    })
    it('should read_identifier()', function(){
        opf_data.read_identifier('calibre').should.eql({ scheme: 'calibre', value: '30', id: 'calibre_id' })
    })
    //Wrapper.prototype.read_creator = function(file_as){}; //if file_as is empty, return all;
    it('should read_creator()',function(){
        opf_data.read_creator('Lawrence, Mark').should.eql({ "file-as": 'Lawrence, Mark', value: 'Lawrence, Mark', role: 'aut' })
    })
    it('should read_contributor()',function(){
        opf_data.read_contributor('calibre').should.eql({ 'file-as': 'calibre', value: 'calibre (0.8.9) [http://calibre-ebook.com]', role: 'bkp' })
    })
    it('should read_date()',function(){
        opf_data.read_date().should.eql('2011-08-01T16:00:00+00:00');
    })
    it('should read_description()',function(){
        (opf_data.read_description() == null).should.be.true;
    })
    it('should read_meta()',function(){
        opf_data.read_meta('calibre:timestamp').should.eql({ value: '2011-08-03T00:50:32+00:00', name: 'calibre:timestamp' } );
    })
});