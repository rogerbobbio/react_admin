/*
RUTA: /api/mysql/screens
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
const { validateFields } = require('../../middlewares/validate-fields');
var controller = require('./systemScreen.controller');
const { validateJWT } = require('../../middlewares/validate-jwt');

// Init
var app = express();

// getAllScreens
app.get('/', validateJWT , controller.getAllScreens);
// createScreen
app.post('/', 
[
    validateJWT,
    check('title', 'The title is mandatory').not().isEmpty(),
    validateFields
]
, controller.createScreen);
// updateScreen
app.put('/:id',
[    
    validateJWT,
    check('title', 'The title is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateScreen);
// deleteScreen
app.delete('/:id', validateJWT, controller.deleteScreen);
// searchScreens
app.get('/search/', controller.searchScreens);
// getScreenInfo by id
app.get('/:id', validateJWT, controller.getScreenInfo);
// getScreensByModuleId
app.get('/search/bymoduleid/:search', controller.getScreensByModuleId);

module.exports = app;