const Router = require('koa-router');
const router = new Router();

const fs = require('fs');

router.get('/', async(ctx) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./frontend/index.html');
})

module.exports = router;