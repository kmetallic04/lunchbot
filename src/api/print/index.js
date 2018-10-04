const express = require('express');
const router  = express.Router();

const handlebars = require('handlebars');
const puppeteer  = require('puppeteer');
const fs         = require('fs-extra');

const { getAll } = require('../../utils/models');
const {
    log,
    sendServerError
} = require('../../utils');


const generatePage = async (orders) => {
    const template = './templates/orders.hbs';
    const html     = await fs.readFile(template, 'utf-8');
    await handlebars.compile(html)(orders);
}

router.get('/vendor=:vendor&paid=:paid', async (req, res) => {
    const {
        vendor,
        paid
    } = req.params;

    const filters = {};

    if (vendor !== 'all') filters.vendor = vendor;
    if (paid !== 'all') filters.paid = paid;

    log.info(filters)
    
    getAll('order', filters)
        .then( async (orders) => {
            const browser = await puppeteer.launch({
                executablePath: '/usr/bin/chromium-browser',
                args: [
                    '--headless',
                    '--disable-gpu',
                    '--disable-dev-shm-usage'
                ]
            });
            const page = await browser.newPage();
            // const content = await generatePage(orders);
            const content = '<h1>Hello Puppetjeer</h1>'

            await page.setContent(content);
            await page.emulateMedia('screen');

            await page.pdf({
                path: '/tmp/orders.pdf',
                format: 'A4',
                printBackground: true
            });

            await browser.close();
            res.status(200).sendFile('./tmp/orders.pdf');
        })
        .catch(error => {
            log.error(error);
            sendServerError(res, error);
        });
});

module.exports = router;
