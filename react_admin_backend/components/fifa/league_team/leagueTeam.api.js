/*
RUTA: /api/mysql/leagueTeams
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

var controller = require('./leagueTeam.controller');

// Init
var app = express();

// getAllLeagueTeams
app.get('/', validateJWT , controller.getAllLeagueTeams);

// createLeagueTeam
app.post('/', 
[
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields
]
, controller.createLeagueTeam);

// updateLeagueTeam
app.put('/:id',
[    
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateLeagueTeam);

// deleteLeagueTeam
app.delete('/:id', validateJWT, controller.deleteLeagueTeam);

// searchLeagueTeams
app.get('/search/', controller.searchLeagueTeams);

// getLeagueTeamInfo
app.get('/:id', validateJWT, controller.getLeagueTeamInfo);

// getLeagueTeamsByLeagueId
app.get('/search/bymoduleid/:search', controller.getLeagueTeamsByLeagueId);

module.exports = app;