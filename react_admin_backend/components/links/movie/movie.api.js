/*
RUTA: /api/mysql/movies
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
var controller = require('./movie.controller');
const { validateJWT } = require('../../../middlewares/validate-jwt');

// Init
var app = express();

// createMovie
app.post('/', 
[
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    check('link', 'The link is mandatory').not().isEmpty(),
    check('ranking', 'The ranking is mandatory').not().isEmpty(),
    check('category_id', 'The movie category is mandatory').not().isEmpty(),
    check('actor_id', 'The actor is mandatory').not().isEmpty(),
    check('language_id', 'The language is mandatory').not().isEmpty(),
    validateFields
]
, controller.createMovie);
// updateMovie
app.put('/:id',
[    
    validateJWT,
    check('description', 'The description is mandatory').not().isEmpty(),
    check('link', 'The link is mandatory').not().isEmpty(),
    check('ranking', 'The ranking is mandatory').not().isEmpty(),
    check('category_id', 'The movie category is mandatory').not().isEmpty(),
    check('actor_id', 'The actor is mandatory').not().isEmpty(),
    check('language_id', 'The language is mandatory').not().isEmpty(),
    validateFields,
]
, controller.updateMovie);
// deleteMovie
app.delete('/:id', validateJWT, controller.deleteMovie);


// getAllMovies
app.get('/', validateJWT , controller.getAllMovies);
// getMovieInfo by id
app.get('/:id', validateJWT, controller.getMovieInfo);
// searchMovies
app.get('/search/main/:search', controller.searchMovies);
// searchMoviesByParameters
app.get('/search/byparam/', controller.searchMoviesByParameters);

module.exports = app;