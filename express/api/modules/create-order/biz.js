const BaseBiz = require('../core/biz');
const moment = require('moment');
// const { Locker } = require('../../core')

class CreateOrderBiz extends BaseBiz {

    async createOrder({ productLines }) {
        // Locker.unlock(locks);
        const lines = [];
        const errors = [];
        // desc stock all product in order
        for (let i = 0; i < productLines.length; i++) {
            const line = productLines[i];
            const { productId, quantity } = line;
            
            const updateStock = await this
                .query
                .table('product')
                .decrement({
                    stock: quantity,
                })
                .where({ 
                    id: productId 
                })
                .where('stock', '>=', quantity);
            
            // validate update success
            if (updateStock === 0) {
                errors.push({ productId, quantity });
            } else {
                lines.push({
                    productId,
                    quantity,
                });
            }
        }

        if (errors.length > 0) {
            throw new Error('INVALID_PRODUCT_ID_OR_STOCK');
        }

        // create new order
        const insertOrder = await this
            .query
            .table('order')
            .insert({});

        const orderId = insertOrder[0];

        // create order lines
        await this
            .query
            .table('order_line')
            .insert(lines.map(line => {
                return {
                    order_id: orderId,
                    product_id: line.productId,
                    quantity: line.quantity,
                }
            }));
        
        return orderId;
    }
}

module.exports = CreateOrderBiz;