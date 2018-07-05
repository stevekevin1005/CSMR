const knex = require('knex');
const path = require('path');
const transformer = require('knex-csv-transformer').transformer;
const transfomerHeader = require('knex-csv-transformer').transfomerHeader;

exports.seed = transformer.seed({
    table: 'movies',
    file: path.join(__dirname, './data_set/movies.csv'),
    transformers: [
        transfomerHeader('movieId', 'id'),
        transfomerHeader('title', 'title'),
        transfomerHeader('genres', 'genre'),
    ]
});