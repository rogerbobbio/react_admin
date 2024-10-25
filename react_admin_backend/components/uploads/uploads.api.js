/*
RUTA: /api/mysql/uploads
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
const expressFileUpload = require('express-fileupload');
var controller = require('./uploads.controller');
const { validateJWT } = require('../../middlewares/validate-jwt');

// Init
var app = express();

app.use(expressFileUpload());
app.put('/:type/:id', validateJWT, controller.uploads);
app.get('/image/:type/:image', controller.getImage);

module.exports = app;