const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
//const Albergue = require('./database/updateDB');

app.use(cors());

//***************
// GET REQUESTS *
// **************

app.get('/', (request, response) => {
    response.send('<h1>CAMINO ALBERGUES</h1>')
})
// GET ALL CAMINOS
/*
* Albergue.find({}).then(albergues => {
*       response.json(albergues)
*   })
* */


// GET BY CAMINO
/*
* Albergue.find({ camino: 'Camino Francés' }).then(albergues => {
*   response.json(albergues)
* })
* * Albergue.find({ camino: 'Camino Portugués' }).then(albergues => {
*   response.json(albergues)
* })
* * Albergue.find({ camino: 'Camino del Norte' }).then(albergues => {
*   response.json(albergues)
* })
* * Albergue.find({ camino: 'Camino Primitivo' }).then(albergues => {
*   response.json(albergues)
* })
* * Albergue.find({ camino: 'Vía de la Plata' }).then(albergues => {
*   response.json(albergues)
* })
* * * Albergue.find({ camino: 'Fisterra y Muxía' }).then(albergues => {
*   response.json(albergues)
* })
* */

// GET BY TOWN
/*
* let town = req.params.town ?
* Albergue.find({ town: town }).then(albergues => {
*   response.json(albergues)
* })
* */

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

