/*
RUTA: /api/mysql/players
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

var controller = require('./player.controller');

// Init
var app = express();

// createPlayer
app.post('/', 
[
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    check('league_id', 'The league is mandatory').not().isEmpty(),
    check('league_team_id', 'The league team is mandatory').not().isEmpty(),
    check('player_version_id', 'The player version is mandatory').not().isEmpty(),
    check('player_zone_id', 'The player zone is mandatory').not().isEmpty(),
    check('player_position_id', 'The player position is mandatory').not().isEmpty(),
    check('country_id', 'The player country is mandatory').not().isEmpty(),
    check('rating', 'The player rating is mandatory').not().isEmpty(),
    check('player_type', 'The player type is mandatory').not().isEmpty(),
    validateFields
]
, controller.createPlayer);

// updatePlayer
app.put('/:id',
[    
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    check('league_id', 'The league is mandatory').not().isEmpty(),
    check('league_team_id', 'The league team is mandatory').not().isEmpty(),
    check('player_version_id', 'The player version is mandatory').not().isEmpty(),
    check('player_zone_id', 'The player zone is mandatory').not().isEmpty(),
    check('player_position_id', 'The player position is mandatory').not().isEmpty(),
    check('country_id', 'The player country is mandatory').not().isEmpty(),
    check('rating', 'The player rating is mandatory').not().isEmpty(),
    check('player_type', 'The player type is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updatePlayer);

// deletePlayer
app.delete('/:id', validateJWT, controller.deletePlayer);

// getAllPlayers
app.get('/', validateJWT , controller.getAllPlayers);

// getAllPlayersDuplicate
app.get('/search/playersDuplicate/', validateJWT , controller.getAllPlayersDuplicate);

// getPlayerInfo by id
app.get('/:id', validateJWT, controller.getPlayerInfo);

// searchPlayers
app.get('/search/main/:search', controller.searchPlayers);

// searchPlayersByParameters
app.get('/search/byparam/', controller.searchPlayersByParameters);

module.exports = app;