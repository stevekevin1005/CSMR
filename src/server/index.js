const serve = require('koa-static');
const Koa = require('koa');
const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');

const app = new Koa();
const PORT = process.env.PORT || 1337;
app.use(serve(__dirname + '/../../frontend'));
app.use(indexRoutes.routes());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;