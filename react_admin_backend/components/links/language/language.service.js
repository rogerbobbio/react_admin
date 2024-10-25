const dataAccess = require('./language.DAL');

function getAllLanguages() {    
    return dataAccess.getAllLanguages()
    .then(function(res){
        return res;
    });    
}

function searchLanguages(searchValue) {
    return dataAccess.searchLanguages(searchValue)
    .then(function(res){
        return res;        
    });    
}

function createLanguage(description, createUser) {    
    return dataAccess.createLanguage(description, createUser)
    .then(function(res){
        return res;
    });    
}

function updateLanguage(languageId, req) {
    return dataAccess.updateLanguage(languageId, req)
    .then(function(res){
        return res;
    });    
}

function deleteLanguage(languageId) {
    return dataAccess.deleteLanguage(languageId)
    .then(function(res){
        return res;
    });    
}

function getLanguageInfo(description) {
    return dataAccess.getLanguageInfo(description)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getLanguageInfoById(languageId) {
    return dataAccess.getLanguageInfoById(languageId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}


module.exports = {
    getAllLanguages,
    searchLanguages,
    createLanguage,    
    updateLanguage,
    deleteLanguage,
    getLanguageInfo,
    getLanguageInfoById
}