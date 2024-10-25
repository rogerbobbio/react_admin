/*
RUTA: /api/mysql/playerPositions
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

var controller = require('./playerPosition.controller');

// Init
var app = express();

// getAllPlayerPositions
app.get('/', validateJWT , controller.getAllPlayerPositions);

// createPlayerPosition
app.post('/', 
[
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields
]
, controller.createPlayerPosition);

// updatePlayerPosition
app.put('/:id',
[    
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updatePlayerPosition);

// deletePlayerPosition
app.delete('/:id', validateJWT, controller.deletePlayerPosition);

// searchPlayerPositions
app.get('/search/:search', controller.searchPlayerPositions);

module.exports = app;