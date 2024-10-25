/*
RUTA: /api/mysql/playerZones
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

var controller = require('./playerZone.controller');

// Init
var app = express();

// getAllPlayerZones
app.get('/', validateJWT , controller.getAllPlayerZones);

// createPlayerZone
app.post('/', 
[
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields
]
, controller.createPlayerZone);

// updatePlayerZone
app.put('/:id',
[    
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updatePlayerZone);

// deletePlayerZone
app.delete('/:id', validateJWT, controller.deletePlayerZone);

// searchPlayerZones
app.get('/search/', controller.searchPlayerZones);

// getPlayerZoneInfo
app.get('/:id', validateJWT, controller.getPlayerZoneInfo);

// getPlayerZonesByPlayerPositionId
app.get('/search/bymoduleid/:search', controller.getPlayerZonesByPlayerPositionId);

module.exports = app;