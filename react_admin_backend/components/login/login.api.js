/*
RUTA: /api/mysql/login
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
const { validateJWT } = require('../../middlewares/validate-jwt');
var controller = require('./login.controller');

// Init
var app = express();

app.post('/',
[    
    check('email', 'The email is mandatory').isEmail(),
    check('password', 'The password is mandatory').not().isEmpty(),

    validateFields,
]
, controller.login);

app.get('/renew', validateJWT , controller.renewToken);

module.exports = app;