const knex = require('../db/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

let userRegister = async(email, password) => {
    return await knex('users').insert({
        email: email,
        password: bcrypt.hashSync(password, saltRounds)
    });
}

let getUserId = async(email) => {
    let user = await knex('users')
        .where({
            email: email,
        }).first();
    if (user == undefined) return false;

    return user.id;
}

module.exports = {
    checkEmail,
    verifyIdentidy,
    userRegister,
    getUserId
};