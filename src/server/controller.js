const fs = require('fs')

function addRoutes(router, routes) {

    for (let index in routes) {
        let route = routes[index];
        switch (route.method) {
            case 'post':
                router.post(route.uri, route.fn);
                console.log(`Register post url: ${route.uri}`);
                break;
            case 'get':
                router.get(route.uri, route.fn)
                console.log(`Register get url: ${route.uri}`)
                break
            default:
                console.log(`Invalid url: ${route}`)
        }
    }
}

function addControllers(router) {
    let files = fs.readdirSync(__dirname + '/controllers')

    let controllerFiles = files.filter(f => {
        return f.endsWith('.js')
    })

    for (let index in controllerFiles) {
        let controllerFile = controllerFiles[index];
        console.log(`process controller: ${controllerFile}...`);
        let routes = require(__dirname + `/controllers/${controllerFile}`);
        addRoutes(router, routes);
    }
}

module.exports = () => {
    let router = require('koa-router')();
    addControllers(router);
    return router;
}