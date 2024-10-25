/*
RUTA: /api/mysql/userRoles
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
var controller = require('./userRole.controller');
const { validateJWT } = require('../../middlewares/validate-jwt');

// Init
var app = express();

// getAllRoles
app.get('/', validateJWT , controller.getAllUserRoles);
// createUserRole
app.post('/', 
[
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields
]
, controller.createUserRole);
// updateUserRole
app.put('/:id',
[    
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateUserRole);
// deleteUserRole
app.delete('/:id', validateJWT, controller.deleteUserRole);
// searchUserRoles
app.get('/search/:search', controller.searchUserRoles);

module.exports = app;