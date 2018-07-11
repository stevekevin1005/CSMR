const supertest = require('supertest');
const chai = require('chai');
const app = require('./../index');

const expect = chai.expect;
const request = supertest(app.listen());


describe('Movie function test:', () => {
    it('Movie recommand list.', (done) => {
        request
            .get('/api/movie/recommand_list')
            .expect(200)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.equal('success');
                expect(res.body.movies).to.be.an('array');
                done();
            });
    });

    it('Movie candidate list.', (done) => {
        request
            .get('/api/movie/candidate_list')
            .expect(200)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.equal('success');
                expect(res.body.movies).to.be.an('array');
                done();
            });
    });

    it('Rate movie.', (done) => {
        request
            .post('/api/movie/rate')
            .send({
                movie_id: 1,
                rate: 1
            })
            .expect(200)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.equal('success');
                done();
            });
    });
})