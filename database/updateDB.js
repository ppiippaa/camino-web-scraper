// CONNECTS TO DB AND WRITES DATA FROM ALBERGUES.JSON

const mongoose = require('mongoose');
const alberguesFromJSON = require('../data/albergues.json');
require('dotenv').config();
const url = process.env.MONGO_URI;

console.log('url: ', url)


// CONNECT TO DATABASE
// mongoose.connect(url, error => {
//     if(error) {
//         console.error('connected to database failed with error: ', error)
//         process.exit(1)
//     }
//     console.log('connected to database')
// })

mongoose.connect(url)
    .then(result => {
        console.log('connected to database')
    })
    .catch((error) => {
        console.log('error connected to database: ', error.message)
    })


// DEFINE SCHEMA(SHAPE OF COLLECTION)
const albergueSchema = new mongoose.Schema({
    name: String,
    address: String,
    town: String,
    phone: String,
    webUrl:  String,
    bookingUrl: String,
    locationInfo: String,
    availability: String,
    entryFrom: String,
    coordinates:
        {
            lat: String,
            long: String
        },
    accommodation: [
        {
            typeOfAccommodation: String,
            numOfPlaces: Number
        }
    ],
    amenities: [String],
    camino: String,
    image: String
})

albergueSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// DEFINE COLLECTION
const Albergue = mongoose.model('Albergue', albergueSchema)


alberguesFromJSON.forEach(albergue => {
    const albergueData = new Albergue(albergue)
    albergueData.save()
    //console.log(albergue.name, 'saved');
})

console.log('done');

module.exports = mongoose.model('Albergue', albergueSchema);









