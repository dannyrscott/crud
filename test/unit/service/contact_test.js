'use strict';

const BPromise = require('bluebird');
const Chance = require('chance');
const chance = new Chance();
const DAO = require('../../../lib/dao/contact');
const Service = require('../../../lib/service/contact');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const afterEach = lab.afterEach;
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;
const should = require('should');
const sinon = require('sinon');

describe('Contact Service', () => {
    let sandbox = sinon.sandbox.create();
    let serviceDAO;
    let dbStub;
    let params;

    afterEach((done) => {
        sandbox.restore();

        done();
    });

    beforeEach((done) => {
        dbStub = sandbox.stub();
        serviceDAO = new Service(dbStub);
        params = {
            name: chance.first() + ' ' + chance.last(),
            company: chance.word(),
            small_image_url: chance.url(),
            large_image_url: chance.url(),
            email: chance.email(),
            website: chance.url(),
            birthday: chance.timestamp(),
            street_address: chance.address(),
            city: chance.city(),
            state: chance.state(),
            country: chance.pickone(['US', 'CA']),
            postal_code: chance.pickone([chance.zip(), chance.postal()]),
            latitude: chance.latitude({
                fixed: 5
            }),
            longitude: chance.longitude({
                fixed: 5
            }),
            work_phone: chance.phone(),
            home_phone: chance.phone(),
            mobile_phone: chance.phone()
        };

        done();
    });

    describe('Create contact', () => {
        let createStub;

        beforeEach((done) => {
            createStub = sandbox.stub(DAO.prototype, 'create');

            done();
        });

        it('Should returnthe URI', (done) => {
            let id = chance.natural();

            createStub.returns(BPromise.resolve(id));

            serviceDAO.create(params)
                .then((resp) => {
                    should.exist(resp);
                    should(resp).eql('/v1/contact/' + id);
                    should(createStub.callCount).eql(1);
                    should(createStub.args[0][0]).eql(params);
                })
                .done(done, done);
        });
    });
});
