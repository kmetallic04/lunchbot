let chai = require('chai');
let expect = chai.expect;
let should = chai.should();
let chaiHttp = require('chai-http');

let app = require('../../app');
let server = require('../../bin/www');
let mongoose = require('mongoose');
let Item = require('../../src/models/items');

chai.use(chaiHttp);

let item = {
    name : "Tea",
    category : "Drinks",
    price: 50,
    vendor : "bobs"
};

describe('Items', () => {
    beforeEach( (done) => {
        //Remove all items before any test.
        Item.remove({});
        done();
    });

    describe('POST item', () => {
        it('should post an item', (done) => {
            chai.request(app)
                .post('/items/create')
                .set('content-type', 'application/json')
                .send(item)
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should throw an error on failure', (done) => {
            chai.request(app)
                .post('/items/create')
                .set('content-type', 'application/json')
                .send({})
                .end( (err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('PUT item', () => {
        it('should edit an existing item', (done) => {
            chai.request(app)
                .post('/items/create')
                .set('content-type', 'application/json')
                .send(item)
                .end( (err, res) => {
                    let itemId = res.body.data._id;

                    chai.request(app)
                        .put('/items/edit/' + itemId)
                        .set('content-type', 'application/json')
                        .send({name: 'Coffee', category: 'Drinks', price: 60, vendor: "kibanda"})
                        .end( (err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('should throw an error on failure to edit', (done) => {
            chai.request(app)
                .put('/items/edit/' + 'random id')
                .send(item)
                .end( (err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });

    describe('GET item', () => {
        it('should get all items', (done) => {
            chai.request(app)
                .get('/items')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should get an item by id', (done) => {
            chai.request(app)
                .post('/items/create')
                .set('content-type', 'application/json')
                .send(item)
                .end( (err, res) => {
                    let id = res.body.data._id;

                    chai.request(app)
                        .get('/items/item/' + id)
                        .end( (err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('should return null when trying to retrieve a non existent item', (done) => {
            chai.request(app)
                .get('/items/item/' + '5b78983494e2e400df54d285')
                .end( (err, res) => {
                    res.should.have.status(200);
                    expect(res.body.data).to.be.null;
                    done();
                });
        });
    });

    describe('DELETE item', () => {
        it('should delete an existing item by id', (done) => {
            chai.request(app)
                .post('/items/create')
                .set('content-type', 'application/json')
                .send(item)
                .end( (err, res) => {
                    res.should.have.status(200);

                    let _id = res.body.data._id;

                    chai.request(app)
                        .delete('/items/delete/' + _id)
                        .end( (err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });
    });
});