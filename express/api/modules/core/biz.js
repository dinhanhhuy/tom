const { Knex } = require('../../core');

class BaseBiz {
    constructor(options) {
        this.trx = (options || {}).trx || null;
    }

    static async transaction(callback) {
        const result = await Knex.transaction(async (trx) => {
            return await callback(trx);
        });
        return result;
    }

    get query() {
        const { trx } = this;
        let result = Knex;

        if (trx) {
            result = Knex.transacting(trx);
        }

        return result;
    }
}

module.exports = BaseBiz;