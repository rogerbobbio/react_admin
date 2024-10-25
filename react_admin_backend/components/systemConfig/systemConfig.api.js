/*
RUTA: /api/mysql/systemConfig
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
var controller = require('./systemConfig.controller');
const { validateJWT } = require('../../middlewares/validate-jwt');

// Init
var app = express();

// updateSystemConfig
app.put('/', validateJWT, controller.updateSystemConfig);
// getSystemConfigInfo
app.get('/', validateJWT , controller.getSystemConfigInfo);

module.exports = app;