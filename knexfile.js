const path = require('path');

const BASE_PATH = path.join(__dirname, 'src', 'server', 'db');

module.exports = {
    development: {
        client: 'pg',
        connection: `postgres://yangjunzhang:@localhost:5432/CFMRS`,
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds')
        }
    }
};