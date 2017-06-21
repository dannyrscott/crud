'use strict';

const Chance = require('chance');
const chance = new Chance();
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const afterEach = lab.afterEach;
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const Glue = require('glue');
const index = require('../../lib/');
const it = lab.it;
const should = require('should');
const sinon = require('sinon');

describe('hapi server tests', () => {
    let sandbox = sinon.sandbox.create();
    let composeStub;

    afterEach((done) => {
        sandbox.restore();
        done();
    });

    beforeEach((done) => {
        composeStub = sandbox.stub(Glue, 'compose');
        done();
    });

    it('should start up and not throw', (done) => {
        should.doesNotThrow(function() {
            index();
        });
        should(composeStub.callCount).eql(1);
        should(composeStub.args[0][0]).be.an.Object();
        should(composeStub.args[0][1]).be.an.Object();
        should(composeStub.args[0][2]).be.a.Function();
        done();
    });

    it('should bubble up errors', (done) => {
        let cb,
            err = new Error('Boom');
        index();
        should(composeStub.args[0][2]).be.a.Function();
        cb = composeStub.args[0][2];
        should.throws(
            () => {
                cb(err);
            },
            /Boom/
        );
        done();
    });

    it('should start the server', (done) => {
        let serverStub = {
            start: sandbox.stub(),
            info: {
                uri: chance.url()
            }
        };
        let logStub = sandbox.stub(console, 'log');

        let cb;
        index();
        should(composeStub.args[0][2]).be.a.Function();
        cb = composeStub.args[0][2];

        cb(null, serverStub);

        should(serverStub.start.callCount).eql(1);
        should(serverStub.start.args[0][0]).be.a.Function();

        serverStub.start.args[0][0]();

        should(logStub.callCount).eql(1);
        should(logStub.args[0][0]).containEql('Server listning:');
        should(logStub.args[0][0]).containEql(serverStub.info.uri);

        done();
    });
});
