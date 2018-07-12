const knex = require('../db/connection');

getUsersWithMoviesRate = async() => {
    let movie_like_data = await knex('movie_like').select('*');
    let data_set = {};
    movie_like_data.forEach((data) => {
        if (data_set[data.user_id] == undefined) data_set[data.user_id] = {};
        data_set[data.user_id][data.movie_id] = data.rate;
    });
    return data_set;
}

getUserRateMovies = async(user_id) => {
    return await knex('movies')
        .select('movies.id as id')
        .select('movies.title')
        .select('movies.genre')
        .select('movie_like.rate')
        .leftJoin('movie_like', function() {
            this.on('movies.id', '=', 'movie_like.movie_id');
            this.on(user_id, '=', 'movie_like.user_id');
        })
        .whereNotNull('rate')
        .orderBy('id', 'asc');
}

getMovieWithRate = async() => {
    return await knex('movies')
        .select('movies.id as id')
        .select('movies.title')
        .select('movies.genre')
        .sum('movie_like.rate')
        .groupBy('movies.id')
        .leftJoin('movie_like', function() {
            this.on('movies.id', '=', 'movie_like.movie_id');
        })
        .orderBy('id', 'asc');
}

rateMovie = async(user_id, movie_id, rate) => {
    return await knex('movie_like').insert({
        user_id: user_id,
        movie_id: movie_id,
        rate: rate
    });
}

updateMovieRate = async(user_id, movie_id, rate) => {
    return await knex('movie_like')
        .where('user_id', user_id)
        .where('movie_id', movie_id)
        .update({
            rate: rate
        });
}

module.exports = {
    getUsersWithMoviesRate,
    getMovieWithRate,
    getUserRateMovies,
    rateMovie,
    updateMovieRate
};