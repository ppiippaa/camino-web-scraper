// create headless browser instance
const puppeteer = require('puppeteer');

async function startBrowser() {
    let browser;
    try {
        console.log('opening browser');
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        })
    } catch(err) {
        console.log('could not create browser instance => ', err);
    }
    return browser
}

module.exports = {
    startBrowser
}