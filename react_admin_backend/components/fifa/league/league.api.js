/*
RUTA: /api/mysql/league
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

var controller = require('./league.controller');

// Init
var app = express();

// getAllLeagues
app.get('/', validateJWT , controller.getAllLeagues);

// createLeague
app.post('/', 
[
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields
]
, controller.createLeague);

// updateLeague
app.put('/:id',
[    
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateLeague);

// deleteLeague
app.delete('/:id', validateJWT, 
           controller.deleteLeague);

// searchLeagues
app.get('/search/:search', controller.searchLeagues);

// getLeagueInfo
app.get('/search/byname/:search', controller.getLeagueInfo);

module.exports = app;