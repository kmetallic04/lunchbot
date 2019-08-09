const Vendor = require('../../src/models/vendors');
const expect = require('chai').expect;

describe('Vendor Model', function () {

    describe('validation', function () {

        let options = {}

        it('must have a name', done => {
            let vendor = new Vendor(options);
            vendor.validate(e => {
                expect(e.errors.name).to.exist;
                expect(e.errors.name.message).to.equal('Vendor name is required');
            });
            done();
        });

        it('must have a phone number', done => {
            options.name = 'Kbanda'
            let vendor = new Vendor(options);
            vendor.validate(e => {
                expect(e.errors.phone).to.exist;
                expect(e.errors.phone.message).to.equal('Phone number is required');
            });
            done();
        });
    });
});

