const http = require('http');
const request = require('supertest');
const expect = require('chai').expect;
const accountsAddon = require('../lib/index');
const app = require('ibird').newApp({
    open: true
});

app.import(accountsAddon, {
    payloadGetter: function (ctx) {
        const { username, password } = ctx.query;
        return (username === 'yinfxs' && password === '123456') ? {
            username: 'yinfxs',
            name: 'Daniel Yin',
            app: 'ibird',
            home: 'http://ibird.yinfxs.com'
        } : null;
    }
});
app.play();

// describe('Accounts', function () {
//     it('POST /login', function (done) {
//         request(http.createServer(app.callback()))
//             .post('/login')
//             .expect(200)
//             .end(function (err, res) {
//                 if (err) return done(err);
//                 expect(res.body.data).to.be.a('object');
//                 // expect(res.body.data).to.have.property('token');
//                 done();
//             });
//     });
// });