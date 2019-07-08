const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const uuid = require('uuid/v4');

const slackRoutes = require('./src/api/slack');
const vendorRoutes = require('./src/api/vendors');
const orderRoutes = require('./src/api/orders');
const itemRoutes = require('./src/api/items');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/slack', slackRoutes);
app.use('/vendors', vendorRoutes);
app.use('/orders', orderRoutes);
app.use('/items', itemRoutes);

// 404
app.use((req, res) => {
    res.status(404).send({
        status: 404,
        message: 'The requested resource was not found',
    });
});

// 5xx
app.use((err, req, res) => {
    log.error(err.stack);
    const message = process.env.NODE_ENV === 'production'
        ? 'Something went wrong, we\'re looking into it...'
        : err.stack;
    res.status(500).send({
        status: 500,
        message,
    });
});

module.exports = app;
