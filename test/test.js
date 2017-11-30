const http = require('http');
const request = require('supertest');
const expect = require('chai').expect;
const accountsAddon = require('../lib/index');
const app = require('ibird').newApp();

const tokenKey = 'mytoken';
const secretOrPrivateKey = 'ibird';

app.import(accountsAddon, {
    tokenKey,
    secretOrPrivateKey,
    payloadGetter: function (ctx) {
        const { username, password } = ctx.query;
        return (username === 'yinfxs' && password === '123456') ? {
            username: 'yinfxs',
            name: 'Daniel Yin',
            app: 'ibird',
            home: 'http://ibird.yinfxs.com'
        } : null;
    },
    whitelists: [
        'POST /login'
    ]
});
app.play(null);

describe('Accounts', function () {
    let data;

    it('POST /login', function (done) {
        request(http.createServer(app.callback()))
            .post('/login')
            .query({ username: 'yinfxs' })
            .query({ password: '123456' })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.data).to.have.property(tokenKey);
                data = res.body.data;
                done();
            });
    });

    it('GET /decode', function (done) {
        request(http.createServer(app.callback()))
            .get('/decode')
            .query({ [tokenKey]: data[tokenKey] })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('username');
                expect(res.body.data.username).to.be.equal('yinfxs');
                done();
            });
    });

    it('GET /verify', function (done) {
        request(http.createServer(app.callback()))
            .get('/verify')
            .set(tokenKey.toUpperCase(), data[tokenKey])
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('username');
                expect(res.body.data.username).to.be.equal('yinfxs');
                done();
            });
    });

    it('POST /logout', function (done) {
        request(http.createServer(app.callback()))
            .post('/logout')
            .send({ [tokenKey]: data[tokenKey] })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.be.equal('ok');
                done();
            });
    });

    it('GET /test_auth', function (done) {
        request(http.createServer(app.callback()))
            .get('/test_auth')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('errcode');
                expect(res.body.errcode).to.be.equal(500);
                done();
            });
    });
});