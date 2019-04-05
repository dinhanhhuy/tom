const Config = require('../config');

const Knex = require('knex')({
    client: Config.database.client,
    connection: {
        host: Config.database.connection.host,
        user: Config.database.connection.user,
        password: Config.database.connection.password,
        database: Config.database.connection.database,
    },
    pool: {
        min: Number(Config.database.pool.min),
        max: Number(Config.database.pool.max),
    },
    acquireConnectionTimeout: Config.database.pool.acquire,
});

module.exports = Knex;