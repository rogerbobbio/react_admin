/*
RUTA: /api/mysql/actors
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
var controller = require('./actor.controller');
const { validateJWT } = require('../../../middlewares/validate-jwt');

// Init
var app = express();

// getAllActors
app.get('/', validateJWT , controller.getAllActors);
// createActor
app.post('/', 
[
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields
]
, controller.createActor);
// updateActor
app.put('/:id',
[    
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateActor);
// deleteActor
app.delete('/:id', validateJWT, 
           controller.deleteActor);
// searchActors
app.get('/search/:search', controller.searchActors);
// searchActors
app.get('/search/byname/:search', controller.getActorInfo);

module.exports = app;