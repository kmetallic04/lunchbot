const Vendor = require('../../models/vendors');
const expect = require('chai').expect;

describe('Vendor', function () {

    describe('validation', function () {

        it('must have a name', done => {
            let vendor = new Vendor();
            vendor.validate(e => {
                expect(e.errors.name).to.exist;
                expect(e.errors.name.message).to.equal('Vendor name is required');
            });
            done();
        });

        it('must have a phone number', done => {
            let vendor = new Vendor({ name: 'Kbanda' });
            vendor.validate(e => {
                expect(e.errors.phone).to.exist;
                expect(e.errors.phone.message).to.equal('Phone number is required');
            });
            done();
        });

        it('must have valid phone number', done => {
            let vendor = new Vendor({ name: 'Kbanda', phone: '0700595009' });
            vendor.validate(e => {
                expect(e.errors.phone).to.exist;
                expect(e.errors.phone.message).to.equal('Invalid phone number');
            });
            done();
        });
    });

    it.skip('checks vendor already registered', done => {
        let vendor1 = new Vendor({ name: 'Kbanda', phone: '+254700595009' });
        let vendor2 = new Vendor({ name: 'Kbanda', phone: '+254700595009' });
        vendor2.validate( e => {
            expect(e.errors.name).to.exist;
            expect(e.errors.name.message).to.equal('Vendor already exists');
        });
        done();
    });
});

