const bcrypt = require('bcrypt');
const saltRounds = 10;
exports.seed = (knex, Promise) => {
    return knex('users').del()
        .then(() => {
            return knex('users').insert({
                email: 'user1@example.com',
                password: bcrypt.hashSync('user1', saltRounds)
            });
        });
};