const expect = require('chai').expect;
const Item = require('../../src/models/items');

describe('Item', function () {

    describe('validation', function () {
        const options = {};
        it('must have a name', done => {
            let item = new Item(options);
            item.validate(e => {
                expect(e.errors.name).to.exist;
                expect(e.errors.name.message).to.equal('Name is required');
            });
            done();
        });

        it('must have a category', done => {
            options['name'] = 'coffee';
            let item = new Item(options);
            item.validate(e => {
                expect(e.errors.category).to.exist;
                expect(e.errors.category.message).to.equal('Category is required');
            });
            done();
        });

        it('must have a price', done => {
            options['category'] = 'Drinks';
            let item = new Item(options);
            item.validate(e => {
                expect(e.errors.price).to.exist;
                expect(e.errors.price.message).to.equal('Price is required');
            });
            done();
        });

        it('must have a vendor', done => {
            options['price'] = 150;
            let item = new Item(options);
            item.validate(e => {
                expect(e.errors.vendor).to.exist;
                expect(e.errors.vendor.message).to.equal('Vendor is required');
            });
            done();
        });
    });
});

