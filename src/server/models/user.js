const knex = require('../db/connection');
const bcrypt = require('bcrypt');

let checkEmail = async(email) => {
    let user = await knex('users')
        .where({
            email: email,
        }).first();
    return user != undefined ? true : false;
}

let verifyIdentidy = async(email, password) => {
    let user = await knex('users')
        .where({
            email: email,
        }).first();
    if (user == undefined) return false;

    let verify = await bcrypt.compare(password, user.password);

    return verify;
}

module.exports = {
    checkEmail,
    verifyIdentidy
};