const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Green Light');
});

app.post('/lipa', (req, res) => {
    console.log(req.body);
    //You can choose to log other stuff from the req.body object
    res.status(200).send('OK');
});
app.listen(process.env.PORT || 3000, (server) => {
    console.log('Good to Go!');
});