/*
RUTA: /api/mysql/permissions
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
var controller = require('./systemPermission.controller');
const { validateJWT } = require('../../middlewares/validate-jwt');

// Init
var app = express();

// createPermission
app.post('/', 
[
    validateJWT,
    check('role_id', 'The role is mandatory').not().isEmpty(),
    check('module_id', 'The module is mandatory').not().isEmpty(),
    check('screen_id', 'The option is mandatory').not().isEmpty(),
    validateFields
]
, controller.createPermission);
// updatePermission
app.put('/:id', validateJWT, controller.updatePermission);
// deletePermission
app.delete('/:id', validateJWT, controller.deletePermission);

// getAllPermissions
app.get('/', validateJWT , controller.getAllPermissions);
// getPermissionInfo by id
app.get('/:id', validateJWT, controller.getPermissionInfo);
// getPermissionByScreen
app.get('/search/byscreen/', controller.getPermissionByScreen);
// searchScreens
app.get('/search/main/', controller.searchPermissions);
// getSystemIndexByTable
app.get('/search/systemindex/:table', controller.getSystemIndexByTable);

module.exports = app;