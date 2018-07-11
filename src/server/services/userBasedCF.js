const movieFunction = require('../models/movies');

let data = {
    n_sim_user: 20,
    trainSet: {},
    user_sim_matrix: {},
};
let init = () => {

};

let calc_user_sim = () => {
    // Building movie-user table
    let movie_user = {};
    for (let user in data.trainSet) {
        for (let movie in data.trainSet[user]) {
            if (movie_user[movie] == undefined) movie_user[movie] = new Map();
            movie_user[movie].set(user, data.trainSet[user][movie]);
        }
    }
    // Build user co-rated movies matrix
    for (let movie in movie_user) {
        movie_user[movie].forEach((rateA, userA) => {
            movie_user[movie].forEach((rateB, userB) => {
                if (userA != userB) {
                    if (data.user_sim_matrix[userA] == undefined) data.user_sim_matrix[userA] = new Map();
                    if (!data.user_sim_matrix[userA].has(userB)) data.user_sim_matrix[userA].set(userB, 0);
                    data.user_sim_matrix[userA].set(userB, (data.user_sim_matrix[userA].get(userB) + ((rateA + rateB) / 2)));
                }
            });
        });
    }
    // Calculating user similarity matrix
    for (let u in data.user_sim_matrix) {
        data.user_sim_matrix[u].forEach((rate, user) => {
            data.user_sim_matrix[u].set(user, rate / Math.sqrt(Object.keys(data.trainSet[u]).length * Object.keys(data.trainSet[user]).length));
        });
    }
};

let recommend = (user, from, count) => {
    try {
        let rank = new Map();
        let watched_movies = data.trainSet[user];
        let user_sim_matrix = new Map([...data.user_sim_matrix[user].entries()].sort((a, b) => {
            return a[1] < b[1];
        }).slice(0, data.n_sim_user));
        user_sim_matrix.forEach((rate, u) => {
            for (let movie in data.trainSet[u]) {
                if (!(movie in watched_movies)) {
                    if (!rank.has(movie)) rank.set(movie, 0);
                    rank.set(movie, rank.get(movie) + rate);
                }
            }
        });

        return [...rank.entries()].sort((a, b) => {
            return a[1] < b[1];
        }).slice(from, count);
    } catch (error) {
        console.log(error);
    }

    return 1;
};

(() => {
    init();
    calc_user_sim();
})();

module.exports = {
    recommend
}