/*
RUTA: /api/mysql/playerVersions
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

var controller = require('./playerVersion.controller');

// Init
var app = express();

// getAllPlayerVersions
app.get('/', validateJWT , controller.getAllPlayerVersions);

// createPlayerVersion
app.post('/', 
[
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields
]
, controller.createPlayerVersion);

// updatePlayerVersion
app.put('/:id',
[    
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updatePlayerVersion);

// deletePlayerVersion
app.delete('/:id', validateJWT, controller.deletePlayerVersion);

// searchPlayerVersions
app.get('/search/:search', controller.searchPlayerVersions);

module.exports = app;