var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRoute = require('./routes/index');
var slackRoutes = require('./routes/slack');
var vendorRoutes = require('./routes/vendors');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoute);
app.use('/slack', slackRoutes);
app.use('/vendors', vendorRoutes);

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
