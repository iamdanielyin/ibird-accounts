const http = require('http');
const request = require('supertest');
const expect = require('chai').expect;
const accountsAddon = require('../lib/index');
const app = require('/Users/yinfxs/WebstormProjects/ibird').newApp();

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
app.play();

// describe('Accounts', function () {
//     let data;
//     afterEach(function () {
//         console.log(data);
//     });

//     it('POST /login', function (done) {
//         request(http.createServer(app.callback()))
//             .post('/login')
//             .query({ username: 'yinfxs' })
//             .query({ password: '123456' })
//             .expect(200)
//             .end(function (err, res) {
//                 if (err) return done(err);
//                 expect(res.body.data).to.have.property(tokenKey);
//                 data = res.body.data;
//                 done();
//             });
//     });
//     it('POST /decode', function (done) {
//         request(http.createServer(app.callback()))
//             .post('/decode')
//             .query({ [tokenKey]: data[tokenKey] })
//             .expect(200)
//             .end(function (err, res) {
//                 if (err) return done(err);
//                 expect(res.body).to.have.property('data');
//                 done();
//             });
//     });
// });