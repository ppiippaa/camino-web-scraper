# Camino Web Scraper

A Node.js web scraping application that collects accommodation data for the Camino de Santiago from the Gronze website.

The scraper uses Puppeteer to navigate through Camino routes and stages, find individual albergue pages, extract structured information, remove duplicate entries, and save the resulting data as a JSON file.

## What it does

The scraper follows the structure of the source website:

Gronze
↓
Camino routes
↓
Stages
↓
Albergue pages
↓
Extract accommodation data
↓
Remove duplicates
↓
Save as JSON

For each albergue, the scraper collects information including:

- Name
- Address
- Town
- Phone number
- Website
- Booking URL
- Location information
- Availability
- Opening information
- Camino/route
- Coordinates
- Accommodation types and capacity
- Amenities
- Main image

The resulting data is saved as a JSON file in the `data` folder.

## Technologies

- Node.js
- JavaScript
- Puppeteer
- MongoDB
- Mongoose
- Express
- dotenv
- Nodemon

## Project Structure

```text
camino-web-scraper/
│
├── data/
│
├── database/
│
├── browser.js
├── index.js
├── pageController.js
├── pageScraper.js
├── routes.js
├── selectorFunction.js
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
