/*
RUTA: /api/mysql/modules
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
var controller = require('./systemModule.controller');
const { validateJWT } = require('../../middlewares/validate-jwt');

// Init
var app = express();

// getAllModules
app.get('/', validateJWT , controller.getAllModules);
// createModule
app.post('/', 
[
    validateJWT,
    check('title', 'The title is mandatory').not().isEmpty(),
    validateFields
]
, controller.createModule);
// updateModule
app.put('/:id',
[    
    validateJWT,
    check('title', 'The title is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateModule);
// deleteModule
app.delete('/:id', validateJWT, controller.deleteModule);
// searchModules
app.get('/search/:search', controller.searchModules);
// getModuleInfo by id
app.get('/:id', validateJWT, controller.getModuleInfo);

module.exports = app;