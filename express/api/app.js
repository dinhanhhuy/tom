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
})();

module.exports = app;

// register modules
require('./modules/create-order');