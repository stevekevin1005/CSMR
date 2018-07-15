const movieFunction = require('../models/movies');
const userFunction = require('../models/user');
const userBasedCF = require('../services/userBasedCF');
const jwt = require('jsonwebtoken');

let getMovieRecommand = async(ctx, next) => {
    try {
        let from = ctx.query.from || 0;
        let count = ctx.query.count || 5;
        if (ctx.request.headers['authorization']) {
            let token = ctx.request.headers['authorization'];
            let user = jwt.verify(token.replace('Bearer ', ''), CONFIG.JWT_SECRET);
            let user_id = await userFunction.getUserId(user.email);
            let recommand_movies_id = await userBasedCF.recommend(user_id, from, count);

            let movie_id_list = recommand_movies_id.map((arr) => { return arr[0] });
            let movies = await movieFunction.getRecommendMovie(movie_id_list, user_id);
            ctx.send(200, {
                status: 'success',
                description: 'get personal recommendation list',
                movies: movies.slice(from, count)
            });
        } else {
            let movies = await movieFunction.getMovieWithRate();
            ctx.send(200, {
                status: 'success',
                description: 'get recommendation list',
                movies: movies.slice(from, count)
            });
        }
    } catch (err) {
        ctx.send(404, {
            status: 'error',
            description: err
        });
    }
}

let getMovierRateList = async(ctx, next) => {
    try {
        let token = ctx.request.headers['authorization'];
        let user = jwt.verify(token.replace('Bearer ', ''), CONFIG.JWT_SECRET);
        let user_id = await userFunction.getUserId(user.email);
        let from = ctx.query.from || 0;
        let count = ctx.query.count || 5;
        let movies = await movieFunction.getUserRateMovies(user_id);
        ctx.send(200, {
            status: 'success',
            description: 'get movie rate list',
            movies: movies.slice(from, count)
        });
    } catch (err) {
        ctx.send(404, {
            status: 'error',
            description: err
        });
    }
}

let rateMovie = async(ctx, next) => {
    try {
        let token = ctx.request.headers['authorization'];
        let user = jwt.verify(token.replace('Bearer ', ''), CONFIG.JWT_SECRET);
        let user_id = await userFunction.getUserId(user.email);
        let movie_id = ctx.request.body.movie_id;
        let rate = ctx.request.body.rate;

        await userBasedCF.add_movie_rate(user_id, movie_id, rate);
        ctx.send(200, {
            status: 'success',
            description: 'rate movie success.'
        });
    } catch (err) {
        ctx.send(404, {
            status: 'error',
            description: err
        });
    }
}

let updateMovie = async(ctx, next) => {
    try {
        let token = ctx.request.headers['authorization'];
        let user = jwt.verify(token.replace('Bearer ', ''), CONFIG.JWT_SECRET);
        let user_id = await userFunction.getUserId(user.email);
        let movie_id = ctx.request.body.movie_id;
        let rate = ctx.request.body.rate;

        await userBasedCF.update_movie_rate(user_id, movie_id, rate);

        ctx.send(200, {
            status: 'success',
            description: 'rate movie success.'
        });
    } catch (err) {

        ctx.send(404, {
            status: 'error',
            description: err
        });
    }
}

module.exports = [{
    method: 'get',
    uri: '/api/movie/recommand_list',
    fn: getMovieRecommand,
}, {
    method: 'get',
    uri: '/api/movie/rate_list',
    fn: getMovierRateList,
}, {
    method: 'post',
    uri: '/api/movie/rate',
    fn: rateMovie,
}, {
    method: 'put',
    uri: '/api/movie/update_score',
    fn: updateMovie,
}]