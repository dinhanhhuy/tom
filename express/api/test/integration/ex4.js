const Core = require('../core');
const moment = require('moment');
const timeoutApi = 50000;

describe('**************************** Example 4: ****************************', () => {
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
    it('execute concurrent /purchases', async function () {
        this.timeout(timeoutApi);

        const params = [
            [
                { productID: 1, quantity: 2 },
                { productID: 2, quantity: 1 },
            ],
            [
                { productID: 1, quantity: 1 },
                { productID: 2, quantity: 5 },
            ],
        ];

        const tasks = [];
        for (let i = 0; i < params.length; i++) {
            let task = Core
                .requestApi({
                    method: 'post',
                    url: '/purchases',
                })
                .send(params[i]);
            tasks.push(task);
        }

        await Promise.all(tasks);
    });
    it('validateDB', async function () {
        await Core.validateMultiConditionDB({
            conditions: [
                [
                    { id: 1, stock: 8 },
                    { id: 2, stock: 4 },
                ],
                [
                    { id: 1, stock: 9 },
                    { id: 2, stock: 0 },
                ],
            ],
        });
    });
});