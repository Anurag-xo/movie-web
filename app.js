// A SIMPLE ROUTING WITH EXPRESS AND JOI TO VALIDATE THE REQUESTS OF A MOVIE WEBSITE GENRES.
const winston = require('winston');
const config = require('config');
const Joi = require('joi'); // requiring joi package which is useful in validataion.
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express'); // requiring express for http requests.
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Listening on port ${port}...`);
    }
});

module.exports = { server };

