var express = require('express');
var controller = require('./root.controller');

// Init
var app = express();

app.get('/', controller.getAppInfo);
app.get('/connection', controller.testConnection);

module.exports = app;