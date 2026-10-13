/*
MYSQL Controller for Movie
*/


var service = require('./movie.service');

async function getMovieInfo(req, res) {

    var movieId = req.params.id;    

    service.getMovieInfoById(movieId)
    .then(function(movie) {
      if(!movie){
        return res.status(404).json({
          ok:false,
          msg: `Movie Id ${movieId} was not found`
        });
      }
       
      res.send({
        ok: true,
        movie
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

async function getAllMovies(req, res) {

  service.getAllMovies()
  .then(function(movies) {

    const totalRecords = movies.length;
         
    res.send({
      ok: true,
      totalRecords,
      movies,      
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

async function createMovie(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { description, link, ranking, subtitle,
          serie, old, converting, pending, note, category_id, actor_id,
          language_id, user_create } = req.body;

  service.getMovieByDescriptionLink(description, link)
  .then(function(movie) {

      if (movie === null) {

        service.createMovie(description, link, ranking, subtitle,
                           serie, old, converting, pending, note, category_id, actor_id,
                           language_id, user_create)
        .then(function(movie) {
              
          res.send({
            ok: true,
            movieId: movie.insertId            
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
            msg: 'Description or Link already registered.'
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

async function updateMovie(req, res) {
  var movieId = req.params.id;
  try {

    const movie = await service.getMovieInfoById(movieId);
        
    if(!movie){
      return res.status(400).json({
          ok:false,
          msg: `Movie Id ${movieId} was not found.`
      });
    } else {

      const { description, link } = req.body;

      var movieByDescription = null;
      var movieByLink = null;

      if(movie.description !== description) {
        movieByDescription = await service.getMovieByDescription(description);
      }

      if(movie.link !== link) {
        movieByLink = await service.getMovieByLink(link);
      }

      if (movieByDescription !== null || movieByLink !== null) {
        return res.status(400).json({
            ok:false,
            msg: `There is already a movie with that description or link `
        });
      } else {

        // Lista blanca: solo se actualizan los campos editables
        const fields = ['description', 'link', 'ranking', 'subtitle', 'serie', 'old', 'converting',
                        'pending', 'note', 'category_id', 'actor_id', 'language_id'];
        const values = { user_update: req.uid, update_date: new Date() };
        fields.forEach(f => { if (req.body[f] !== undefined) values[f] = req.body[f]; });

        service.updateMovie(movieId, values)
                  .then(function(movie) {
                        
                    res.send({
                      ok: true,
                      affectedRows: movie.affectedRows
                    });
                  })
                  .catch((err) => setImmediate(() => { 
                    console.log('updateMovie: ' + Date() + '\n' + err)
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

async function deleteMovie(req, res) {

  var movieId = req.params.id;

  service.getMovieInfoById(movieId)
  .then(function(movie) {
    if(!movie){
        return res.status(400).json({
            ok:false,
            msg: `Movie Id ${movieId} was not found.`
        });
    }    
    
    service.deleteMovie(movieId)
      .then(function(movie) {
            
        res.send({
          ok: true,
          affectedRows: movie.affectedRows
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

async function searchMovies(req, res) {

  var searchValue = req.params.search;

  service.searchMovies(searchValue)
  .then(function(movies) {

    const totalRecords = movies.length;
         
    res.send({
      ok: true,
      totalRecords,
      movies
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

// Helpers para leer los query params del filtro
const toText = v => (typeof v === 'string' ? v.trim() : '');
const toInt = v => { const n = parseInt(v, 10); return Number.isNaN(n) ? null : n; };
// '0' / '1' filtran; '', '3' o ausente = sin filtro
const toBool = v => (v === '0' || v === '1' ? +v : null);
const toDate = v => (/^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v : null);

async function searchMoviesByParameters(req, res) {

  const q = req.query;
  const limit = toInt(q.limit);
  const offset = toInt(q.offset);

  const params = {
    search: toText(q.search),
    description: toText(q.description),
    link: toText(q.link),
    categoryId: toInt(q.categoryId),
    actorId: toInt(q.actorId),
    languageId: toInt(q.languageId),
    converting: toBool(q.converting),
    pending: toBool(q.pending),
    subtitle: toBool(q.subtitle),
    old: toBool(q.old),
    rankingMin: toInt(q.rankingMin),
    dateFrom: toDate(q.dateFrom),
    dateTo: toDate(q.dateTo),
    orderBy: toText(q.orderBy),
    limit: limit > 0 ? Math.min(limit, 100) : null,
    offset: offset > 0 ? offset : 0,
  };

  service.searchMoviesByParameters(params)
  .then(function({ movies, totalRecords }) {

    res.send({
      ok: true,
      totalRecords,
      movies
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
    getMovieInfo,
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    searchMovies,
    searchMoviesByParameters
}