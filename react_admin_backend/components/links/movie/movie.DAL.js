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

function updateMovie(movieId, fields) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = [
                fields,
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

// Escapa los comodines de LIKE para que '%' y '_' se busquen como texto
const escapeLike = v => '%' + v.replace(/[\\%_]/g, '\\$&') + '%';

const ORDER_BY = {
    description: 'm.description',
    recent: 'm.create_date DESC',
    ranking: 'm.ranking DESC, m.description',
};

function runQuery(sql, params) {
    return new Promise(( resolve, reject ) => {
        pool.query(sql, params, ( err, rows ) => (err ? reject(err) : resolve(rows)));
    });
}

async function searchMoviesByParameters(p) {

    var filters = [];
    var where = ' WHERE 1=1 ';

    if (p.search) {
        var value = escapeLike(p.search);
        where += '   AND (m.description LIKE ? OR m.link LIKE ? OR a.name LIKE ?)';
        filters.push(value, value, value);
    }
    if (p.description) {
        where += '   AND m.description LIKE ?';
        filters.push(escapeLike(p.description));
    }
    if (p.link) {
        where += '   AND m.link LIKE ?';
        filters.push(escapeLike(p.link));
    }
    if (p.categoryId > 0) {
        where += '   AND m.category_id = ?';
        filters.push(p.categoryId);
    }
    if (p.actorId > 0) {
        where += '   AND m.actor_id = ?';
        filters.push(p.actorId);
    }
    if (p.languageId > 0) {
        where += '   AND m.language_id = ?';
        filters.push(p.languageId);
    }
    ['converting', 'pending', 'subtitle', 'old'].forEach(field => {
        if (p[field] !== null) {
            where += `   AND m.${field} = ?`;
            filters.push(p[field]);
        }
    });
    if (p.rankingMin > 0) {
        where += '   AND m.ranking >= ?';
        filters.push(p.rankingMin);
    }
    if (p.dateFrom) {
        where += '   AND m.create_date >= ?';
        filters.push(p.dateFrom);
    }
    if (p.dateTo) {
        where += '   AND m.create_date < DATE_ADD(?, INTERVAL 1 DAY)';
        filters.push(p.dateTo);
    }

    var from = ' FROM movie m   '+
               ' JOIN movie_category c ON c.id = m.category_id '+
               ' JOIN actor a ON a.id = m.actor_id '+
               ' JOIN language l ON l.id = m.language_id ';

    var sql = 'SELECT m.*,  '+
              '       c.description as category_description, '+
              '       a.name as actor_name, '+
              '       l.description as language_description '+
              from + where +
              ' ORDER BY ' + (ORDER_BY[p.orderBy] || ORDER_BY.description);

    if (!p.limit) {
        const movies = await runQuery(sql, filters);
        return { movies, totalRecords: movies.length };
    }

    const [movies, count] = await Promise.all([
        runQuery(sql + ' LIMIT ? OFFSET ?', [...filters, p.limit, p.offset]),
        runQuery('SELECT COUNT(*) AS total' + from + where, filters),
    ]);
    return { movies, totalRecords: count[0].total };
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