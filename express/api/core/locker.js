const redis = require('redis');
const { promisify } = require('util');

class Locker {
    static get client() {
        const config = require('../config');

        if (this._client === undefined)
            this._client = redis.createClient(config.redis);

        return this._client;
    }

    static get _locker() {
        // todo: timeout as parameter
        const timeout = 60;
        return promisify(require('redis-lock')(Redis.client, timeout));
    }

    static lock(keys) {
        const locks = keys.map(k => this._locker(k));
        await Promise.all(locks);
        return locks;
    }

    static unlock(locks) {
        locks.forEach(lock => {
            lock.unlock();
        })
    }
};

module.exports = Locker;