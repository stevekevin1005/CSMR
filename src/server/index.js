// config
global.CONFIG = require('./config');
// koa core middleware
const serve = require('koa-static');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const genres = require('koa-res');
// jwt
const jwt = require('jsonwebtoken');
const jwtKoa = require('koa-jwt');
const util = require('util');
const verify = util.promisify(jwt.verify);

const app = new Koa();
const PORT = process.env.PORT || 1337;
const controller = require('./controller')();
const respond = require('koa-respond');
app.use(bodyParser());
app.use(respond());
app.use(genres({ debug: true }));
app.use(logger());
app.use(jwtKoa({ secret: CONFIG.JWT_SECRET }).unless({
    path: [
        '/api/user/check',
        '/api/user/login',
        '/api/user/register'
    ]
}))
app.use(serve(__dirname + '/../../frontend'));
app.use(controller.routes());
app.use(controller.allowedMethods());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;