/*
MYSQL Controller for Languages
*/


var service = require('./language.service');

async function getAllLanguages(req, res) {

  service.getAllLanguages()
  .then(function(languages) {

    const totalRecords = languages.length;
         
    res.send({
      ok: true,
      totalRecords,
      languages,      
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

async function createLanguage(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { description, user_create } = req.body;    

  service.getLanguageInfo(description)
  .then(function(language) {      

      if (language === null) {        
        
        service.createLanguage(description, user_create)
        .then(function(language) {          

          res.send({
            ok: true,
            languageId: language.insertId
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
            msg: 'Language already registered.'
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

async function updateLanguage(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var languageId = req.params.id;

    try {

      const language = await service.getLanguageInfoById(languageId);

      if(!language){             
        return res.status(400).json({
          ok:false,
          msg: `Language Id ${languageId} was not found`
        });
      } else {

        const { description } = req.body;

        var languagerInfo = null;

        if(language.description !== description) {
          languagerInfo = await service.getLanguageInfo(description);
        }

        if (languagerInfo !== null) {                
          return res.status(400).json({
              ok:false,
              msg: `Ya existe un idioma con esa descripcion: ${description} `
            });
        } else {

          service.updateLanguage(languageId, req)
            .then(function(language) {
                  
              res.send({
                ok: true,
                affectedRows: language.affectedRows
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

async function deleteLanguage(req, res) {

  var languageId = req.params.id;

  service.getLanguageInfoById(languageId)
  .then(function(language) {
    if(!language){
       return res.status(400).json({
        ok:false,
        msg: `Language Id ${languageId} was not found`
      });
    }    
    
    service.deleteLanguage(languageId)
      .then(function(language) {
            
        res.send({
          ok: true,
          affectedRows: language.affectedRows
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

async function searchLanguages(req, res) {
  var searchValue = req.params.search;

  service.searchLanguages(searchValue)
  .then(function(languages) {

    const totalRecords = languages.length;
         
    res.send({
      ok: true,
      totalRecords,
      languages,      
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
    getAllLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    searchLanguages
}