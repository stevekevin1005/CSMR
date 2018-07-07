const userFunction = require('../models/user');
const jwt = require('jsonwebtoken');

let userCheck = async(ctx, next) => {
    try {
        let email = ctx.query.email;
        if (email == undefined || email == '') throw ("no email entered.");
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) throw ("email is illegal.");
        if (await userFunction.checkEmail(email)) throw ("email is exist.");

        ctx.send(200, {
            status: 'success',
            description: 'email is acceptable.'
        });

    } catch (err) {
        ctx.send(202, {
            status: 'error',
            description: err
        });
    }
}

let userLogin = async(ctx, next) => {
    try {
        let email = ctx.request.body.email;
        let password = ctx.request.body.password;
        if (email == undefined || email == '') throw ("no email entered.");
        if (password == undefined || password == '') throw ("no password entered.");
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) throw ("email is illegal.");
        if (!await userFunction.verifyIdentidy(email, password)) throw ("email or password is incorrect.");

        let userToken = {
            email: email
        };
        let token = jwt.sign(userToken, CONFIG.JWT_SECRET, { expiresIn: '1h' });

        ctx.send(200, {
            status: 'success',
            description: 'user login.',
            token: token
        });

    } catch (err) {
        ctx.send(403, {
            status: 'error',
            description: err
        });
    }
}

let userRegister = async(ctx, next) => {
    try {
        let email = ctx.request.body.email;
        let password = ctx.request.body.password;
        if (email == undefined || email == '') throw ("no email entered.");
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) throw ("email is illegal.");
        if (await userFunction.checkEmail(email)) throw ("email is exist.");

        await userFunction.userRegister(email, password);

        let userToken = {
            email: email
        };
        let token = jwt.sign(userToken, CONFIG.JWT_SECRET, { expiresIn: '1h' });

        ctx.send(200, {
            status: 'success',
            description: 'user register.',
            token: token
        });
    } catch (err) {
        ctx.send(403, {
            status: 'error',
            description: err
        });
    }
}

module.exports = [{
    method: 'get',
    uri: '/api/user/check',
    fn: userCheck,
}, {
    method: 'post',
    uri: '/api/user/login',
    fn: userLogin,
}, {
    method: 'post',
    uri: '/api/user/register',
    fn: userRegister,
}]