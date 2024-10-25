/*
RUTA: /api/mysql/categories
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
var controller = require('./movieCategory.controller');
const { validateJWT } = require('../../../middlewares/validate-jwt');

// Init
var app = express();

// getAllCategories
app.get('/', validateJWT , controller.getAllCategories);
// createCategory
app.post('/', 
[
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields
]
, controller.createCategory);
// updateCategory
app.put('/:id',
[    
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateCategory);
// deleteCategory
app.delete('/:id', validateJWT, 
           controller.deleteCategory);
// searchCategories
app.get('/search/:search', controller.searchCategories);

module.exports = app;