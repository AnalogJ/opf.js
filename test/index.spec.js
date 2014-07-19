var opf = require('../index.js');
var should = require('should');
var fs = require('fs')

//this is just simple integration testing
describe('opf', function () {

    describe('#load()', function () {
        it('Should fail if empty xml is loaded', function (done) {
            opf.load('')
                .fail(function(opf_data){
                })
                .then(done,done)
        });
        it('Should correctly load opf file', function (done) {
            fs.readFile( __dirname+'/files/meta.opf', function(err, data) {
                opf.load(data)
                    .then(function(opf_data){
                        opf_data.toJSON().should.be.ok;
                    })
                    .then(done,done)
            });
        });
//
//        it('Should fail if ', function (done) {
//            CoverArtService.download_cover_by_isbn({
//                type: 'isbn',
//                isbn: '0971633896'
//            })
//                .fail(function(err){
//                    err.should.be.a.Error;
//                })
//                .then(done, done);
//        });
//
//        it('Should fail when downloading an invalid image from amazon', function (done) {
//            CoverArtService.download_cover_by_isbn({
//                type: 'isbn',
//                source: 'amazon',
//                isbn: '0971633896'
//            })
//                .fail(function(err){
//                    err.should.be.a.Error;
//                })
//                .then(done, done);
//        });
//
//        it('Should download an image from amazon', function (done) {
//            CoverArtService.download_cover_by_isbn({
//                type: 'isbn',
//                source: 'amazon',
//                isbn: '0971633894'
//            })
//                .spread(function(body, content_type, storage_key){
//                    content_type.should.eql('image/jpeg')
//                    storage_key.should.eql('images/isbn_0971633894.jpg')
//                })
//                .then(done, done);
//        });
//
//        it('Should fail when downloading an invalid image from openlibrary', function (done) {
//            CoverArtService.download_cover_by_isbn({
//                type: 'isbn',
//                source: 'openlibrary',
//                isbn: '0971633896'
//            })
//                .fail(function(err){
//                    err.should.be.a.Error;
//                })
//                .then(done, done);
//        });
//
//        it('Should download an image from openlibrary', function (done) {
//            CoverArtService.download_cover_by_isbn({
//                type: 'isbn',
//                source: 'openlibrary',
//                isbn: '0971633894'
//            })
//                .spread(function(body, content_type, storage_key){
//                    content_type.should.eql('image/jpeg');
//                    storage_key.should.eql('images/isbn_0971633894.jpg');
//                })
//                .then(done, done);
//        });
//
//        it('Should download an isbn13 from openlibrary when provided one.', function (done) {
//            CoverArtService.download_cover_by_isbn({
//                type: 'isbn',
//                source: 'openlibrary',
//                isbn13: '9780060529703'
//            })
//                .spread(function(body, content_type, storage_key){
//                    content_type.should.eql('image/jpeg')
//                    storage_key.should.eql('images/isbn_9780060529703.jpg')
//                    console.log(body.length)
//                })
//                .then(done, done).done();
//        });

    });

});