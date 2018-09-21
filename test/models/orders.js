const expect = require('chai').expect;
const Order = require('../../src/models/orders');

describe('Order', function () {

    describe('validation', function () {
        const options = {};
        it('must have a person', done => {
            let order = new Order(options);
            order.validate(e => {
                expect(e.errors.person).to.exist;
                expect(e.errors.person.message).to.equal('Person is required');
            });
            done();
        });

        it('must have an item', done => {
            options['person'] = {};
            let order = new Order(options);
            order.validate(e => {
                expect(e.errors.item).to.exist;
                expect(e.errors.item.message).to.equal('Item is required');
            });
            done();
        });

        it('must have a vendor', done => {
            options['item'] = 'Rice';
            let order = new Order(options);
            order.validate(e => {
                expect(e.errors.vendor).to.exist;
                expect(e.errors.vendor.message).to.equal('Vendor is required');
            });
            done();
        });

        it('must have an amount', done => {
            options['vendor'] = 'Bobs';
            let order = new Order(options);
            order.validate(e => {
                expect(e.errors.amount).to.exist;
                expect(e.errors.amount.message).to.equal('Amount is required');
            });
            done();
        });
    });
});

