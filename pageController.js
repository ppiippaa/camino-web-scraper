// load up browser and pass into pageScraper function
pageScraper = require('./pageScraper');
const fs = require('fs');

async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        await pageScraper.scraper(browser);
    } catch(err) {
        console.log('could not resolve browser instance => ', err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);