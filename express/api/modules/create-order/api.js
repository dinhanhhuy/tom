const app = require('../../app');
const biz = require('../core/biz');
const CreateOrderBiz = require('../create-order/biz');

app.post('/purchases', async (req, res) => {
    // todo: create wraper try/catch so we dont try catch on each API
    try {
        // todo: validate parameter
        const productLines = req.body;
        const lines = productLines.map(line => {
            return {
                productId: line.productID,
                quantity: line.quantity,
            }
        });

        const result = await biz.transaction(async (trx) => {
            const createOrderBiz = new CreateOrderBiz({ trx });
            const orderId = await createOrderBiz.createOrder({ productLines: lines });
            return {
                order_id: orderId,
            };
        });

        res.json({ successful: true });
    } catch (e) {
        // todo: create custom error type so dont validate each api
        let code = 500;
        let message = { error: 'internal error' };
        if (e.message === 'PRODUCT_OUT_OF_STOCK') {
            code = 422;
            message = { successful: false };
        }
        res.status(code).json(message);
    }
});