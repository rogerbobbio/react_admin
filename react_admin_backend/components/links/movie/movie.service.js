const dataAccess = require('./movie.DAL');

function getMovieByDescription(description) {    
    return dataAccess.getMovieByDescription(description)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getMovieByLink(link) {
    return dataAccess.getMovieByLink(link)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getMovieByDescriptionLink(description,link) {
    return dataAccess.getMovieByDescriptionLink(description,link)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getMovieInfoById(movieId) {
    return dataAccess.getMovieInfoById(movieId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}

function getAllMovies() {    
    return dataAccess.getAllMovies()
    .then(function(res){
        return res;
    });
}

function searchMovies(searchValue) {
    return dataAccess.searchMovies(searchValue)
    .then(function(res){
        return res;
    });    
}

function searchMoviesByParameters(params) {
    return dataAccess.searchMoviesByParameters(params);
}

function createMovie(description, link, ranking, subtitle,
                     serie, old, converting, pending, note, category_id, actor_id,
                     language_id, user_create) {    
    return dataAccess.createMovie(description, link, ranking, subtitle,
                                  serie, old, converting, pending, note, category_id, actor_id,
                                  language_id, user_create)
    .then(function(res){
        return res;
    });    
}

function updateMovie(movieId, values) {
    return dataAccess.updateMovie(movieId, values)
    .then(function(res){
        return res;
    });    
}

function deleteMovie(movieId) {    
    return dataAccess.deleteMovie(movieId)
    .then(function(res){
        return res;
    });    
}

module.exports = {
    getMovieByDescription,
    getMovieByLink,
    getMovieByDescriptionLink,
    getMovieInfoById,
    getAllMovies,
    searchMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    searchMoviesByParameters
}