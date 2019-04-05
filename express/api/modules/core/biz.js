const { Knex } = require('../core')

class BaseBiz {
    constructor({ trx }) {
        this.trx = trx || null;

        BaseBiz.transaction(trx => {
            const dao = new CreateOrderBiz({ trx });
        });
    }

    static async transaction(callback) {
        const result = await Knex.transaction(async (trx) => {
            return await callback({ trx });
        });
        return result;
    }

    get query() {
        const { trx } = this;
        const result = Knex;

        if (trx) {
            Knex.transacting(trx);
        }

        return result;
    }
}

module.exports = BaseBiz;