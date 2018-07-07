const supertest = require('supertest');
const chai = require('chai');
const app = require('./../index');

const expect = chai.expect;
const request = supertest(app.listen());


describe('User function test:', () => {

    it('Check email is if exist.', (done) => {
        request
            .get('/api/user/check')
            .query({
                email: 'user1@example.com'
            })
            .expect(200)
            .end((err, res) => {
                expect(res.statusCode).to.equal(202);
                expect(res.body).to.be.an('object');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.status).to.equal('error');
                done();
            });
    });

    it('User login test.', (done) => {
        request
            .post('/api/user/login')
            .send({
                email: 'user1@example.com',
                password: 'user1'
            })
            .expect(200)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.status).to.equal('success');
                expect(res.body.data.token).to.be.an('string');
                done();
            });
    })
})