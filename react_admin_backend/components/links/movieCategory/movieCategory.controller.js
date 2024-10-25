/*
MYSQL Controller for Categories
*/


var service = require('./movieCategory.service');

async function getAllCategories(req, res) {

  service.getAllCategories()
  .then(function(categories) {

    const totalRecords = categories.length;
         
    res.send({
      ok: true,
      totalRecords,
      categories,      
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

async function createCategory(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { description, user_create } = req.body;    

  service.getCategoryInfo(description)
  .then(function(category) {

      if (category === null) {
        
        service.createCategory(description, user_create)
        .then(function(category) {

          res.send({
            ok: true,
            categoryId: category.insertId
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
            msg: 'Category already registered.'
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

async function updateCategory(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var categoryId = req.params.id;
    try {

      const category = await service.getCategoryInfoById(categoryId);

      if(!category){             
        return res.status(400).json({
          ok:false,
          msg: `Category Id ${categoryId} was not found`
        });
      } else {

        const { description } = req.body;

        var categoryInfo = null;

        if(category.description !== description) {
          categoryInfo = await service.getCategoryInfo(description);
        }

        if (categoryInfo !== null) {                
          return res.status(400).json({
              ok:false,
              msg: `Ya existe una Categoria con esa descripcion: ${description} `
            });
        } else {

          service.updateCategory(categoryId, req)
            .then(function(category) {
                  
              res.send({
                ok: true,
                affectedRows: category.affectedRows
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

async function deleteCategory(req, res) {

  var categoryId = req.params.id;

  service.getCategoryInfoById(categoryId)
  .then(function(category) {
    if(!category){
       return res.status(400).json({
        ok:false,
        msg: `Category Id ${categoryId} was not found`
      });
    }    
    
    service.deleteCategory(categoryId)
      .then(function(category) {
            
        res.send({
          ok: true,
          affectedRows: category.affectedRows
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

async function searchCategories(req, res) {
  var searchValue = req.params.search;

  service.searchCategories(searchValue)
  .then(function(categories) {

    const totalRecords = categories.length;
         
    res.send({
      ok: true,
      totalRecords,
      categories,
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
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories
}