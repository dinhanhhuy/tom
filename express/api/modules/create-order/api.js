const app = require('../../app');
const biz = require('../core/biz');
const CreateOrderBiz = require('../create-order/biz');

app.post('/purchases', async (req, res) => {
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

        res.json(result);
    } catch (e) {
        // todo: create custom api try catch wraper with custom error type
        res.status(500).json({ error: e.message });
    }
});