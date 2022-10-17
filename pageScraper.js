// SCRAPES CAMINO DATA AND WRITES DATA TO ALBERGUES.JSON

const fs = require("fs");
const findSingleEntry = require('./selectorFunction');

const scraperObject = {
    url: 'https://www.gronze.com/',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`navigating to ${this.url}...`);
        await page.goto(this.url);


        let caminoPagePromise = (url) => new Promise(async (resolve, reject) => {
            console.log(url, 'page promise link caminos')
            let newPage = await browser.newPage();
            await newPage.goto(url);
            const etapasUrls = await newPage.$$eval('.camino-etapa a', (links) => {
                return links.map(l => (l.href));
            })
            resolve(etapasUrls)
            await newPage.close()
        })


        let etapaPagePromise = (url) => new Promise(async (resolve, reject) => {
            console.log(url, 'page promise link etapas')
            let newPage = await browser.newPage();
            await newPage.goto(url);
            const etapasUrls = await newPage.$$eval('tbody .views-field-title a', (links) => {
                return links.map(l => (l.href));
            });
            resolve(etapasUrls)
            await newPage.close()
        })

        let alberguePagePromise = (url) => new Promise(async (resolve, reject) => {
                console.log(url, 'page promise link albergue');
                let newPage = await browser.newPage();
                await newPage.goto(url);

                const name = await findSingleEntry(newPage, '.page-header');
                const address = await findSingleEntry(newPage,'.field-name-field-geo-address div.field-item' )
                const town = await findSingleEntry(newPage, '.field-name-field-localidad .field-items .field-item a')
                const phone = await findSingleEntry(newPage, '.field-type-telephone .field-items .field-item a')
                const webUrl = await findSingleEntry(newPage,'.group-albergue-contacto .field-name-field-web a')
                const bookingUrl = await findSingleEntry(newPage,'.field-name-booking-com-link  a')
                const locationInfo = await findSingleEntry(newPage, '.field-name-field-localizacion .field-items .field-item' )
                const availability = await findSingleEntry(newPage, '#bootstrap-panel-3-body .field-name-field-disponibilidad-meses-inclu .field-item' )
                const entryFrom = await findSingleEntry(newPage, '#bootstrap-panel-3-body .field-name-field-hora-de-apertura- .field-item' )
                const camino = await findSingleEntry(newPage, '.localidad-navigator ul li' )
                const image = await findSingleEntry(newPage, '.field-name-field-foto-principal-albergue img.img-responsive')

                const parseCoordinates = (url) => {
                    if (url) {
                        const [lat, long] = url.split('?q=')[1].split('%2C')
                        return {lat, long};
                    }
                }
                const coordinates = parseCoordinates(await findSingleEntry(newPage,'.staticmap-link a')) ;

                const accommodation = await newPage.$$eval('.field-name-field-room-number tr', (elements) => {
                    if (elements.length > 0) {
                        const accom = elements.map(el => {
                            if (!el.lastElementChild.firstElementChild) {
                                return null
                            }

                            switch (
                                el.lastElementChild.firstElementChild
                                    .classList[1]
                                ) {
                                case 'glyphicons-bedroom-nightstand':
                                    return {
                                        typeOfAccommodation: 'room',
                                        numOfPlaces: parseInt(
                                            el.firstElementChild.textContent
                                        ),
                                    }
                                case 'glyphicons-user-structure':
                                    return {
                                        typeOfAccommodation: 'shared',
                                        numOfPlaces: parseInt(
                                            el.firstElementChild.textContent
                                        ),
                                    }

                                case 'glyphicons-home': {
                                    return {
                                        typeOfAccommodation: 'apartment',
                                        numOfPlaces: parseInt(
                                            el.firstElementChild.textContent
                                        ),
                                    }
                                }

                                default:
                                    return null
                            }
                        })
                            .filter((el) => el !== null)

                        return accom?.length ? accom : null;
                    } else {
                        return null;
                    }
                });

                const amenities = await newPage.$$eval('.field-item-gronze-albergue-servicios .field-subitem .field-label', (elements) => {
                    if (elements.length > 0) {
                        return Array.from(elements.map(el => el.textContent));
                    } else {
                        return null;
                    }

                });

                resolve({
                    name,
                    address,
                    town,
                    phone,
                    webUrl,
                    bookingUrl,
                    locationInfo,
                    availability,
                    entryFrom,
                    coordinates,
                    accommodation,
                    amenities,
                    camino,
                    image
                });
                await newPage.close();
            }
        )

        let caminoUrls = await page.$$eval('.pane-home-thumbs-caminos .pane-title a', links => {
            return links.map(l => ({url: l.href}))
        });

        // testing purposes
        //caminoUrls = [caminoUrls[5]];

        const etapaUrls = [];
        for (const camino of caminoUrls) {
            const urls = await caminoPagePromise(camino.url);
            etapaUrls.push(...urls);
        }

        const albergueUrls = [];
        for (etapaUrl of etapaUrls) {
            const urls = await etapaPagePromise(etapaUrl);
            albergueUrls.push(...urls);
        }
        //console.log(albergueUrls);


        const alberguesData = [];
        for (albergueUrl of albergueUrls) {
            const data = await alberguePagePromise(albergueUrl);
            alberguesData.push(data);
        }
        console.log(alberguesData);


        // CHECK FOR DUPE ALBERGUES
        const removedDupesAlberguesData = [...new Set(alberguesData.map(albergue => albergue.address))]
            .map(address => {
                return alberguesData.find(albergue => albergue.address === address)
            })

        // TURN JS ARRAY OF OBJS INTO JSON
        const jsonAlberguesData = JSON.stringify(removedDupesAlberguesData);

        // CREATE DATA FOLDER
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data')
        }

        // STORE JSON DATA IN DATA FOLDER
        fs.writeFileSync(
            `${process.cwd()}/data/albergues.json`,
            jsonAlberguesData,
            (err) => {
                if (err) throw err
                console.log('Data successfully saved')
            }
        )
        process.exit()
    }
}
module.exports = scraperObject;