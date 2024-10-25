const pool = require('../../../database/mysqlpool');

function createMovie(description, link, ranking, subtitle,
                     serie, old, converting, pending, note, category_id, actor_id,
                     language_id, user_create) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = {description, link, ranking, subtitle,
                serie, old, converting, pending, note, category_id, actor_id,
                language_id, user_create};
            var sql = 'INSERT INTO movie SET ?';
          connection.query(sql, values, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function updateMovie(movieId, req) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = [
                req.body,
                movieId
            ];
            var sql = 'UPDATE movie SET ? WHERE id = ?';
          connection.query(sql, values, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function deleteMovie(movieId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'DELETE FROM movie WHERE id = ?';
          connection.query(sql, movieId, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function getMovieByDescription(description) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM movie WHERE description = ?';
          connection.query(sql, description, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function getMovieByLink(link) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM movie WHERE link = ?';
          connection.query(sql, link, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function getMovieByDescriptionLink(description, link) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM movie '+
                  ' WHERE description = ? OR link = ?';
          connection.query(sql, [description, link], ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function getMovieInfoById(movieId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT m.*,  '+
            '       c.description as category_description, '+
            '       a.name as actor_name, '+
            '       l.description as language_description '+
            ' FROM movie m   '+
            ' JOIN movie_category c ON c.id = m.category_id '+
            ' JOIN actor a ON a.id = m.actor_id '+
            ' JOIN language l ON l.id = m.language_id '+
            ' WHERE m.id = ?';
          connection.query(sql, movieId, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function getAllMovies() {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT m.*,  '+
            '       c.description as category_description, '+
            '       a.name as actor_name, '+
            '       l.description as language_description '+
            ' FROM movie m   '+
            ' JOIN movie_category c ON c.id = m.category_id '+
            ' JOIN actor a ON a.id = m.actor_id '+
            ' JOIN language l ON l.id = m.language_id ' + 
            ' ORDER BY m.create_date desc';
          connection.query(sql, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function searchMovies(searchValue) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var value = '%' + searchValue + '%';
            var sql = 'SELECT m.*,  '+
                        '       c.description as category_description, '+
                        '       a.name as actor_name, '+
                        '       l.description as language_description '+
                        ' FROM movie m   '+
                        ' JOIN movie_category c ON c.id = m.category_id '+
                        ' JOIN actor a ON a.id = m.actor_id '+
                        ' JOIN language l ON l.id = m.language_id '+
                      ' WHERE m.description like ? OR m.link like ? OR m.note like ?'+
                      ' ORDER BY m.description';
          connection.query(sql, [value, value, value], ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function searchMoviesByParameters(description, link, categoryId, actorId, languageId, converting, pending) {

    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var filters = [];
            var sql = 'SELECT m.*,  '+
                        '       c.description as category_description, '+
                        '       a.name as actor_name, '+
                        '       l.description as language_description '+
                        ' FROM movie m   '+
                        ' JOIN movie_category c ON c.id = m.category_id '+
                        ' JOIN actor a ON a.id = m.actor_id '+
                        ' JOIN language l ON l.id = m.language_id '+
                        ' WHERE 1=1 ';
                        if (description != '') {
                            var value = '%' + description + '%';
                            sql = sql + '   AND m.description like ?';
                            filters.push(value);
                        }

                        if (link != '') {
                            var value = '%' + link + '%';
                            sql = sql + '   AND m.link like ?';
                            filters.push(value);
                        }

                        if (categoryId > 0) {
                            sql = sql + '   AND m.category_id = ? ';
                            filters.push(categoryId);
                        }
                        if (actorId > 0) {
                            sql = sql + '   AND m.actor_id = ?';
                            filters.push(actorId);
                        }
                        if (languageId > 0) {
                            sql = sql + '   AND m.language_id =?';
                            filters.push(languageId);
                        }
                        if (converting < 3) {
                            sql = sql + '   AND m.converting =?';
                            filters.push(converting);
                        }
                        if (pending > 0) {
                            sql = sql + '   AND m.pending =?';
                            filters.push(pending);
                        }
   
                        sql = sql + ' ORDER BY m.description';
          connection.query(sql, filters, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

module.exports = {
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieByDescription,
    getMovieByLink,
    getMovieByDescriptionLink,
    getMovieInfoById,
    getAllMovies,
    searchMovies,
    searchMoviesByParameters
}