let chai = require('chai');
let expect = chai.expect;
let should = chai.should();
let chaiHttp = require('chai-http');

let app = require('../../app');
let Vendor = require('../../src/models/vendors');

chai.use(chaiHttp);

let vendor = {
    name : "Bobs",
    phone: "+254712345678"
};

describe('Vendors', () => {
    beforeEach( (done) => {
        //Remove all vendors before any test.
        Vendor.remove({}, (err, result) => { })
        done();
    });

    describe('POST vendor', () => {
        it('should post an vendor', (done) => {
            chai.request(app)
                .post('/vendors/create')
                .set('content-type', 'application/json')
                .send(vendor)
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should throw an error on failure', (done) => {
            chai.request(app)
                .post('/vendors/create')
                .set('content-type', 'application/json')
                .send({})
                .end( (err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('PUT vendor', () => {
        it('should edit an existing vendor', (done) => {
            chai.request(app)
                .post('/vendors/create')
                .set('content-type', 'application/json')
                .send(vendor)
                .end( (err, res) => {
                    let vendorId = res.body.data._id;

                    chai.request(app)
                        .put('/vendors/edit/' + vendorId)
                        .set('content-type', 'application/json')
                        .send({name: 'Kibanda', phone: '+254709876543'})
                        .end( (err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('should throw an error on failure to edit', (done) => {
            chai.request(app)
                .put('/vendors/edit/' + 'random id')
                .send(vendor)
                .end( (err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });

    describe('GET vendor', () => {
        it('should get all vendors', (done) => {
            chai.request(app)
                .get('/vendors')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should get an vendor by id', (done) => {
            chai.request(app)
                .post('/vendors/create')
                .set('content-type', 'application/json')
                .send(vendor)
                .end( (err, res) => {
                    let id = res.body.data._id;

                    chai.request(app)
                        .get('/vendors/vendor/' + id)
                        .end( (err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('should return null when trying to retrieve a non existent vendor', (done) => {
            chai.request(app)
                .get('/vendors/vendor/' + '5b78983494e2e400df54d285')
                .end( (err, res) => {
                    res.should.have.status(200);
                    expect(res.body.data).to.be.null;
                    done();
                });
        });
    });

    describe('DELETE vendor', () => {
        it('should delete an existing vendor by id', (done) => {
            chai.request(app)
                .post('/vendors/create')
                .set('content-type', 'application/json')
                .send(vendor)
                .end( (err, res) => {
                    res.should.have.status(200);

                    let _id = res.body.data._id;

                    chai.request(app)
                        .delete('/vendors/delete/' + _id)
                        .end( (err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });
    });
});