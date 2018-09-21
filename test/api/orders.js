let chai = require('chai');
let expect = chai.expect;
let should = chai.should();
let chaiHttp = require('chai-http');

let app = require('../../app');
let Orders = require('../../src/models/orders');

chai.use(chaiHttp);

let order = {
    person: {
        name: 'Royce'
    },
    item: 'Beef',
    vendor: 'bobs',
    amount: 200,
};

describe('Orders', () => {
    beforeEach( (done) => {
        //Remove all orders before any test.
        Orders.remove({});
        done();
    });

    describe('POST order', () => {
        it('should post an order', (done) => {
            chai.request(app)
                .post('/orders/create')
                .set('content-type', 'application/json')
                .send(order)
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should throw an error on failure', (done) => {
            chai.request(app)
                .post('/orders/create')
                .set('content-type', 'application/json')
                .send({})
                .end( (err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('PUT order', () => {
        it('should edit an existing order', (done) => {
            chai.request(app)
                .post('/orders/create')
                .set('content-type', 'application/json')
                .send(order)
                .end( (err, res) => {
                    let orderId = res.body.data._id;

                    chai.request(app)
                        .put('/orders/edit/' + orderId)
                        .set('content-type', 'application/json')
                        .send({item: 'Coffee', person: {} , amount: 60, vendor: "kibanda"})
                        .end( (err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('should throw an error on failure to edit', (done) => {
            chai.request(app)
                .put('/orders/edit/' + 'random id')
                .send(order)
                .end( (err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });

    describe('GET order', () => {
        it('should get all orders', (done) => {
            chai.request(app)
                .get('/orders')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should get an order by id', (done) => {
            chai.request(app)
                .post('/orders/create')
                .set('content-type', 'application/json')
                .send(order)
                .end( (err, res) => {
                    let id = res.body.data._id;

                    chai.request(app)
                        .get('/orders/order/' + id)
                        .end( (err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('should return null when trying to retrieve a non existent order', (done) => {
            chai.request(app)
                .get('/orders/order/' + '5b78983494e2e400df54d285')
                .end( (err, res) => {
                    res.should.have.status(200);
                    expect(res.body.data).to.be.null;
                    done();
                });
        });
    });

    describe('DELETE order', () => {
        it('should delete an existing order by id', (done) => {
            chai.request(app)
                .post('/orders/create')
                .set('content-type', 'application/json')
                .send(order)
                .end( (err, res) => {
                    res.should.have.status(200);

                    let _id = res.body.data._id;

                    chai.request(app)
                        .delete('/orders/delete/' + _id)
                        .end( (err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });
    });
});