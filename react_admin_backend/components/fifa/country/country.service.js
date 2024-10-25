const dataAccess = require('./country.DAL');

function getAllCountries() {    
    return dataAccess.getAllCountries()
    .then(function(res){
        return res;        
    });    
}

function searchCountries(searchValue) {
    return dataAccess.searchCountries(searchValue)
    .then(function(res){
        return res;
    });    
}

function createCountry(name, createUser) {
    return dataAccess.createCountry(name, createUser)
    .then(function(res){
        return res;
    });    
}

function updateCountry(countryId, req) {
    return dataAccess.updateCountry(countryId, req)
    .then(function(res){
        return res;
    });    
}

function deleteCountry(countryId) {
    return dataAccess.deleteCountry(countryId)
    .then(function(res){
        return res;
    });    
}

function getCountryInfo(name) {
    return dataAccess.getCountryInfo(name)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getCountryInfoById(countryId) {
    return dataAccess.getCountryInfoById(countryId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}


module.exports = {
    getAllCountries,
    searchCountries,
    createCountry,
    updateCountry,
    deleteCountry,
    getCountryInfo,
    getCountryInfoById
}