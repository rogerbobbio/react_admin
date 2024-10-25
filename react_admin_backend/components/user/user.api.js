/*
RUTA: /api/mysql/user
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
var controller = require('./user.controller');
const { validateJWT } = require('../../middlewares/validate-jwt');

// Init
var app = express();

// getAllUsers
app.get('/', validateJWT , controller.getAllUsers);
// createUser with Token
app.post('/', 
[
    validateJWT,
    check('userName', 'The user name is mandatory').not().isEmpty(),
    check('password', 'The password is mandatory').not().isEmpty(),
    check('firstName', 'The first name is mandatory').not().isEmpty(),
    check('lastName', 'The last name is mandatory').not().isEmpty(),
    check('email', 'The email is mandatory').isEmail(),
    validateFields
]
, controller.createUser);
// createUser without Token
app.post('/newuser/', 
[    
    check('userName', 'The user name is mandatory').not().isEmpty(),
    check('password', 'The password is mandatory').not().isEmpty(),
    check('firstName', 'The first name is mandatory').not().isEmpty(),
    check('lastName', 'The last name is mandatory').not().isEmpty(),
    check('email', 'The email is mandatory').isEmail(),
    validateFields
]
, controller.createUser);
// getUserInfo by id
app.get('/:id', validateJWT, controller.getUserInfo);
// updateUser
app.put('/:id',
[    
    validateJWT,
    check('email', 'The email is mandatory').isEmail(),
    validateFields,
]
, controller.updateUser);
// deleteUser
app.delete('/:id', validateJWT, controller.deleteUser);
// searchUsers
app.get('/search/:search', controller.searchUsers);

module.exports = app;