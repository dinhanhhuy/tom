const DotEnv = require('dotenv')
const env = _getEnv();

let config = {
    apiPort: env.APP_PORT,
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
};

function _getEnv() {
    const nodeEnv = process.env.NODE_ENV || 'local';
    //get env from config file
    const env = DotEnv.config({path: `${__dirname}/${nodeEnv}.env`}).parsed;
    //assign direct parameter to env
    Object.assign(env, process.env);    //direct parameter have high priority then env file
    //format data
    const keys = Object.keys(env);
    keys.forEach(key => {
        switch (env[key]) {
            case 'true':
                env[key] = true;
                break;
            case 'false':
                env[key] = false;
                break;
            case 'null':
                env[key] = null;
                break;
            case 'undefined':
                env[key] = undefined;
                break;
            default:
                break;
        }
    });
    return env;
}

module.exports = config;