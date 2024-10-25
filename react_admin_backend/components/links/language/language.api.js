/*
RUTA: /api/mysql/languages
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
var controller = require('./language.controller');
const { validateJWT } = require('../../../middlewares/validate-jwt');

// Init
var app = express();

// getAllLanguages
app.get('/', validateJWT , controller.getAllLanguages);
// createLanguage
app.post('/', 
[
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields
]
, controller.createLanguage);
// updateLanguage
app.put('/:id',
[    
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateLanguage);
// deleteLanguage
app.delete('/:id', validateJWT, 
           controller.deleteLanguage);
// searchLanguages
app.get('/search/:search', controller.searchLanguages);

module.exports = app;