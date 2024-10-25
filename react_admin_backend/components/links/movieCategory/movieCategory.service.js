const dataAccess = require('./movieCategory.DAL');

function getAllCategories() {    
    return dataAccess.getAllCategories()
    .then(function(res){
        return res;
    });
}

function searchCategories(searchValue) {
    return dataAccess.searchCategories(searchValue)
    .then(function(res){
        return res;
    });    
}

function createCategory(description, createUser) {    
    return dataAccess.createCategory(description, createUser)
    .then(function(res){
        return res;
    });    
}

function updateCategory(categoryId, req) {
    return dataAccess.updateCategory(categoryId, req)
    .then(function(res){
        return res;
    });    
}

function deleteCategory(categoryId) {
    return dataAccess.deleteCategory(categoryId)
    .then(function(res){
        return res;
    });    
}

function getCategoryInfo(description) {
    return dataAccess.getCategoryInfo(description)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getCategoryInfoById(categoryId) {
    return dataAccess.getCategoryInfoById(categoryId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}


module.exports = {
    getAllCategories,
    searchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryInfo,
    getCategoryInfoById
}