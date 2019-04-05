const app = require('../../api/app');

app.post('/createOrder', async (req, res) => {
    const data = JSON.stringify(req);
    console.log(data);

    res.send(data)
});