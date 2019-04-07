const chai = require('chai');
const chaiHttp = require('chai-http');

const Biz = require('../modules/core/biz');

chai.use(chaiHttp);

class Core {
    static async truncateDB() {
        const biz = new Biz();
        const tables = ['order_line', 'order', 'product'];
        
        await biz
            .query
            .raw(`SET FOREIGN_KEY_CHECKS=0`);

        for (let i = 0; i < tables.length; i++) {
            const table = tables[i];
            const res = await biz
                .query
                .raw(`TRUNCATE \`${table}\``);
        }

        await biz
            .query
            .raw(`SET FOREIGN_KEY_CHECKS=1`);
    }

    static async initDB({ products }) {
        const biz = new Biz();
        const result = await biz
            .query
            .table('product')
            .insert(products);
        // console.log('result', products);
        // console.log(result);
        return result;
    }

    static async validateDB({ products }) {
        const biz = new Biz();
        const datas = await biz
            .query
            .table('product');
        
        products.forEach(product => {
            const matchProduct = datas.find(i => i.id === product.id);
            if (matchProduct.stock !== product.stock) {
                throw new Error('Mismatch product stock')
            }
        });
    }

    static async validateMultiConditionDB({ conditions }) {
        const biz = new Biz();
        const datas = await biz
            .query
            .table('product');

        const conditionsResult = [];

        conditions.forEach(products => {
            let result = true;
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const matchProduct = datas.find(i => i.id === product.id);
                if (matchProduct.stock !== product.stock) {
                    result = false;
                    break;
                }
            }
            conditionsResult.push(result);
        });

        if (!conditionsResult.find(i => i === true)) {
            throw new Error('Mismatch product stock');
        }
    }

    static requestApi({url, method, host, fullUrl}) {
        let request = chai.request(process.env.HOST || host);
        // console.log(`>>>>> ${fullUrl || config.apiServer.path + url}`)

        // console.log(url, method);

        return request
            [method](url)
            .set('content-type', 'application/json');
    }

    static logInfo(...text) {
        console.log('\x1b[36m%s\x1b[0m', ...text);
    }

    static get expect() {
        return chai.expect;
    }
}

module.exports = Core;