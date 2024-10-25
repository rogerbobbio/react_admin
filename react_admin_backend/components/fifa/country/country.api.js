/*
RUTA: /api/mysql/country
*/

/*
NOTA:
1. DAL
2. Service
3. Controller
4. API
*/

// Requires
var express = require('express');
var { check } = require('express-validator');
const { validateFields } = require('../../../middlewares/validate-fields');
const { validateJWT } = require('../../../middlewares/validate-jwt');

var controller = require('./country.controller');

// Init
var app = express();

// getAllCountries
app.get('/', validateJWT , controller.getAllCountries);

// createCountry
app.post('/', 
[
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields
]
, controller.createCountry);

// updateCountry
app.put('/:id',
[    
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateCountry);

// deleteCountry
app.delete('/:id', validateJWT, 
           controller.deleteCountry);

// searchCountries
app.get('/search/:search', controller.searchCountries);

// getCountryInfo
app.get('/search/byname/:search', controller.getCountryInfo);

module.exports = app;