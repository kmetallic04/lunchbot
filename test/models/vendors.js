const Vendor = require('../../models/vendors');
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

        it('must have valid phone number', done => {
            options.phone = '0700595009'
            let vendor = new Vendor(options);
            vendor.validate(e => {
                expect(e.errors.phone).to.exist;
                expect(e.errors.phone.message).to.equal('Invalid phone number');
            });
            done();
        });
    });

    it.skip('checks vendor already registered', done => {
        let options = {
            name: 'Kbanda',
            phone: '+254700595009',
            checkout: {
                BusinessNo: '888888',
                AccountNo: '123445'
            }
        }
        let vendor1 = new Vendor(options);
        let vendor2 = new Vendor(options);
        vendor2.validate( e => {
            expect(e.errors.name).to.exist;
            expect(e.errors.name.message).to.equal('Vendor already exists');
        });
        done();
    });
});

