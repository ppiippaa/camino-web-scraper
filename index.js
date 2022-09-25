// import browser from browser.js
// start browser instance
// plug in browser instance to scraper controller function
const browserObject = require('./browser');
const scraperController = require('./pageController');

let browserInstance = browserObject.startBrowser();

scraperController(browserInstance);