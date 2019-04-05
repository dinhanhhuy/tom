const Config = require('./config');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();
const { Knex } = require('./core');

(async () => {
    //config
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '100mb' }));

    const port = parseInt(Config.apiPort);

    app.listen(port, async () => {
        console.log(`Worker ${process.pid} started at http://localhost:${port}`);
    });

    app.get('/', async (req, res) => {
        try {
            let userOrders = Knex.table('EMPLOYEE');
            
            console.log(userOrders.toString());
            userOrders = await userOrders;

            console.log(userOrders);
            res.send(JSON.stringify(userOrders));
        } catch (e) {
            console.log(e);
        }
    });

    /*
    const userOrders = await Knex.table('user_order');
    console.log(userOrders);
    */
})();

module.exports = { app };