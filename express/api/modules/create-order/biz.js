const BaseBiz = require('../core/biz');
const { Locker } = require('../../core')

class CreateOrderBiz extends BaseBiz {

    async createOrder({ productLines }) {
        // get lock key list products
        const keys = productLines.map(item => {
            return `product_stock#${item.productId}`;
        });
        const locks = await Locker.lock(keys);

        // validate and create new order

        const result = await this.transaction(async (trx) => {
            const lines = [];
            const errors = [];
            // desc stock all product in order
            productLines.forEach(line => {
                const { productId, quantity } = line;
                
                const productId = await this
                    .query
                    .table('product')
                    .decrement({
                        stock: quantity,
                    })
                    .where({ 
                        product_id: productId 
                    })
                    .where('stock', '>', quantity);
                
                // todo: if update 0 records
                console.log(updateStock)
                if (!updateStock) {
                    errors.push({ productId, quantity });
                } else {
                    lines.push({
                        productId,
                        quantity,
                    });
                }
            });

            if (errors.length > 0) {
                throw new Error({
                    message: 'product out of stock',
                    code: 'PRODUCT_OUT_OF_STOCK',
                    data: errors, 
                });
            }

            // create new order
            const orderId = await this
                .query
                .table('order')
                .insert();

            // create order lines
            lines.forEach(line => {
                line.orderId = orderId;
            });
            await this
                .query
                .table('order_line')
                .insert(lines);
        });
        Locker.unlock(locks);
        return result;
    }
}

module.exports = CreateOrderBiz;