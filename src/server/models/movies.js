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
        .sum({ rate: ['movie_like.rate'] })
        .groupBy('movies.id')
        .leftJoin('movie_like', function() {
            this.on('movies.id', '=', 'movie_like.movie_id');
        })
        .whereNotNull('rate')
        .orderBy('rate', 'desc');
}

rateMovie = async(user_id, movie_id, rate) => {
    return await knex('movie_like').insert({
        user_id: user_id,
        movie_id: movie_id,
        rate: rate
    });
}

updateMovieRate = async(user_id, movie_id, rate) => {
    try {
        return await knex('movie_like')
            .where('user_id', user_id)
            .where('movie_id', movie_id)
            .update({
                rate: rate
            });
    } catch (err) {
        return err;
    }

}

getRecommendMovie = async(movie_id_list, user_id) => {
    try {
        let movies = await knex('movies')
            .select('movies.id as id')
            .select('movies.title')
            .select('movies.genre')
            .whereIn('id', movie_id_list);
        if (movies.length < 4) {
            let append_movies = await knex('movies')
                .select('*')
                .whereNotIn('id', function() {
                    this.select('movie_id as id')
                        .from('movie_like')
                        .whereRaw('user_id = ' + user_id)
                })
                .whereNotIn('id', movie_id_list)
                .limit(4 - movies.length);
            movies.push(...append_movies);
        }
        return movies;
    } catch (err) {
        return err;
    }

}

module.exports = {
    getUsersWithMoviesRate,
    getMovieWithRate,
    getUserRateMovies,
    rateMovie,
    updateMovieRate,
    getRecommendMovie
};