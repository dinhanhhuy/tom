const Core = require('../core');
const moment = require('moment');
const timeoutApi = 50000;

describe('Example 2:', () => {
    result = {};
    it('truncate db', async function () {
        await Core.truncateDB();
    });
    it('init db', async function () {
        await Core.initDB({
            products: [
                { id: 1, stock: 10 },
                { id: 2, stock: 5 },
            ]
        });
    });
    it('validate fail /purchases', async function () {
        this.timeout(timeoutApi);
        let res = await Core
            .requestApi({
                method: 'post',
                url: '/purchases',
            })
            .send([
                { productID: 1, quantity: 2 },
                { productID: 2, quantity: 6 }
            ]);
        // Core.logInfo('>>>', JSON.stringify(res.body));
        // Core.logInfo('>>>', JSON.stringify(res));

        Core.expect(res).to.have.status(422);
    });
    it('validateDB', async function () {
        await Core.validateDB({
            products: [
                { id: 1, stock: 10 },
                { id: 2, stock: 5 },
            ]
        });
    });
});