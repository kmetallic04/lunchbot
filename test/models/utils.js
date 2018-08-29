const expect = require('chai').expect;

let {
    getAll,
    get,
    create,
    update,
    delete_
} = require('../../models/utils');

let random, model;

let fixtures = {
    model: ['vendor'],
    // model: ['vendor', 'order', 'item'],
    vendor: {
        name: 'Kbanda',
        phone: '+254700595009',
        checkout: {
            BusinessNo: '888888',
            AccountNo: '123445'
        }
    }
}

describe('Model Utils', function () {

    before( () => {
        random  = Math.floor(Math.random() * fixtures.model.length);
        model = fixtures.model[random];
    });

    it('getAll() throws error on failure', done => {
        getAll(model)
            .then(resp => {
                expect(resp).to.have.property('failure');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();
    });

    it('getAll() wraps data on success', done => {
        getAll(model)
            .then(resp => {
                expect(resp).to.have.property('success');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();
    });

    it('get() throws error on failure', done => {
        get(model)
            .then(resp => {
                expect(resp).to.have.property('failure');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();
    });

    it('get() wraps data on success', done => {
        get(model)
            .then(resp => {
                expect(resp).to.have.property('success');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();
    });

    it('create() throws error on failure', done => {
        create(model)
            .then(resp => {
                console.log(resp);
                expect(resp).to.have.property('success');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();
    });

    it('create() wraps data on success', done => {
        create(model)
            .then(resp => {
                resp.should.have.property('success');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();;
    });

    it('update() throws error on failure', done => {
        update(model)
            .then(resp => {
                resp.should.have.property('failure');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();;
    });

    it('update() wraps data on success', done => {
        update(model)
            .then(resp => {
                resp.should.have.property('success');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();;
    });

    it('delete_() throws error on failure', done => {
        delete_(model)
            .then(resp => {
                resp.should.have.property('failure');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();;
    });

    it('delete_() wraps data on success', done => {
        delete_(model)
            .then(resp => {
                resp.should.have.property('success');
            })
            .catch(err => {
                // console.log(err);
                expect(err).to.have.property('errors');
            })
        done();;
    });
});

