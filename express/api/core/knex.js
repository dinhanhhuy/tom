const Config = require('../config');

/*
database: {
    client: env.DATABASE_CLIENT,
    connection: {
        host: env.DATABASE_CONNECTION_HOST,
        port: env.DATABASE_CONNECTION_PORT,
        user: env.DATABASE_CONNECTION_USER,
        password: env.DATABASE_CONNECTION_PASSWORD,
        database: env.DATABASE_CONNECTION_DATABASE,
    },
    pool: {
        max: env.DATABASE_POOL_MAX,
        min: env.DATABASE_POOL_MIN,
        acquire: env.DATABASE_POOL_ACQUIRE,
        idle: env.DATABASE_POOL_IDLE,
    },
}
*/

console.log(Config.database.pool.min);

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