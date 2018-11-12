const request = require('request');
const { log } = require('../utils')
require('dotenv').load();

// Make a POST request to slack

const postRequest = (url, body) =>  new Promise( (resolve, reject) => {
    request.post({
        url,
        body,
        json:   true,
        auth: {
            bearer: process.env.SLACK_TOKEN
        }
    }, (err, response, body) => {
        //body = JSON.parse(body);
        if (err) {
            reject(err);
        } else if (response.statusCode !== 200) {
            reject(body);
        } else if (body.ok !== true) {
            reject(body);
        } else {
            resolve(body);
        }
    });
});

// Make a GET request to Slack.

const getRequest =  (url, params) => new Promise( (resolve, reject) => {
    request.get({
        url,
        params,
        auth    : {
            bearer: process.env.SLACK_TOKEN
        }
    }, (err, response, body) => {
        body = JSON.parse(body);
        if (err) {
            reject(err);
        } else if (response.statusCode !== 200) {
            reject(body);
        } else if (body.ok !== true) {
            reject(body);
        } else {
            resolve(body);
        }
    });
});

module.exports = { postRequest, getRequest };
