/*
MYSQL Controller for Country
*/


var service = require('./country.service');

async function getAllCountries(req, res) {

  service.getAllCountries()
  .then(function(countries) {

    const totalRecords = countries.length;
         
    res.send({
      ok: true,
      totalRecords,
      countries,
    });
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));
}

async function getCountryInfo(req, res) {

  var searchValue = req.params.search;

  service.getCountryInfo(searchValue)
  .then(function(country) {

    res.send({
      ok: true,      
      country,
    });

  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));
}

async function createCountry(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { name, user_create } = req.body;

  service.getCountryInfo(name)
  .then(function(country) {

      if (country === null) {
        
        service.createCountry(name, user_create)
        .then(function(country) {

          res.send({
            ok: true,
            countryId: country.insertId
          });
        })
        .catch((err) => setImmediate(() => { 
          console.log(Date() + '\n' + err)
          res.status(err.status || 500).json({
            ok: false,
            value: err
          })
        }));

      } else  {
        return res.status(400).json({
            ok:false,
            msg: 'Pais ya registrado.'
        });
      }

  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));
}

async function updateCountry(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var countryId = req.params.id;
    try {

      const country = await service.getCountryInfoById(countryId);

      if(!country){             
        return res.status(400).json({
          ok:false,
          msg: `Country Id ${countryId} was not found`
        });
      } else {

        const { name } = req.body;

        var countryInfo = null;

        if(country.name !== name) {
            countryInfo = await service.getCountryInfo(name);
        }

        if (countryInfo !== null) {                
          return res.status(400).json({
              ok:false,
              msg: `Ya existe un Pais con ese nombre ${name} `
            });
        } else {

          service.updateCountry(countryId, req)
            .then(function(country) {
                  
              res.send({
                ok: true,
                affectedRows: country.affectedRows
              });
            })
            .catch((err) => setImmediate(() => { 
              console.log(Date() + '\n' + err)
              res.status(err.status || 500).json({
                ok: false,
                value: err
              })
            }));

        }

      }

    } catch (error) {
      console.log('TRY:' + Date() + '\n' + error)
            res.status(error.status || 500).json({
              ok: false,
              value: error
            })
    }
  
}

async function deleteCountry(req, res) {

  var countryId = req.params.id;

  service.getCountryInfoById(countryId)
  .then(function(country) {
    if(!country){
       return res.status(400).json({
        ok:false,
        msg: `Country Id ${countryId} was not found`
      });
    }    
    
    service.deleteCountry(countryId)
      .then(function(country) {
            
        res.send({
          ok: true,
          affectedRows: country.affectedRows
        });
      })
      .catch((err) => setImmediate(() => {
        console.log(Date() + '\n' + err) 
        res.status(err.status || 500).json({
          ok: false,
          value: err
        })
      })); 
    
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));        

}

async function searchCountries(req, res) {
  var searchValue = req.params.search;

  service.searchCountries(searchValue)
  .then(function(countries) {

    const totalRecords = countries.length;
         
    res.send({
      ok: true,
      totalRecords,
      countries,
    });
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));
}

module.exports = {
    getAllCountries,
    createCountry,
    updateCountry,
    deleteCountry,
    searchCountries,
    getCountryInfo
}