var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM Movies;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        }
    );
}

exports.Insert = function(title, tagline, genres, callback) {
    var values = [title, tagline];
    connection.query('INSERT INTO movie (title, tagline) VALUES (?, ?)', values,
        function (err, result) {

            if (err == null && genres != null) {
                var genre_qry_values = [];

                if(genres instanceof Array) {
                    for (var i = 0; i < genres.length; i++) {
                        genre_qry_values.push([result.insertId, genres[i]]);
                    }
                }
                else {
                    genre_qry_values.push([result.insertId, genres]);
                }

                console.log(genre_qry_values);

                var genre_qry = 'INSERT INTO movie_genre (movie_id, genre_id) VALUES ?';

                connection.query(genre_qry, [genre_qry_values], function(err, genre_result){
                    if(err) {
                        Delete(result.insertId, function() {
                            callback(err);
                        });
                    }
                    else {
                        callback(err);
                    }
                });
            }
            else {
                callback(err);
            }
        });
}


 exports.GetByID = function(movie_id, callback) {
     console.log(movie_id);
     var query = 'SELECT * FROM movie_info_view WHERE movie_id = ' + movie_id;
     console.log(query);
     connection.query(query,
         function (err, result) {
             if(err) {
                 console.log(err);
                 callback(true);
                 return;
             }
             callback(false, result);
         }
     );
 }


var Delete = function(movie_id, callback) {
//function Delete(movie_id, callback) {
    var qry = 'DELETE FROM Movies WHERE movie_id =' + movie_id;
    connection.query(qry, [movie_id],
        function (err) {
            callback(err);
        });
}

var DeleteMovieGenres = function(movie_id, callback) {
    var genre_qry = 'DELETE FROM movie_genre WHERE movie_id = ?';
    connection.query(genre_qry, movie_id, function (err, result) {
        callback(err, result);
    });
};

var AddMovieGenres = function(movie_id, genre_ids, callback) {
    if (genre_ids != null) {
        var genre_qry_values = [];

        if (genre_ids instanceof Array) {
            for (var i = 0; i < genre_ids.length; i++) {
                genre_qry_values.push([movie_id, genre_ids[i]]);
            }
        }
        else {
            genre_qry_values.push([movie_id, genre_ids]);
        }


        //Left off trying to edit a movie but you dont have this table or columns
        var genre_qry = 'INSERT INTO movie_genre (movie_id, genre_id) VALUES ?';
        connection.query(genre_qry, [genre_qry_values], function (err) {
            callback(err);
        });
    }
};

exports.Update = function(movie_id, title, tagline, genre_ids, callback) {
    console.log(movie_id, title, tagline, genre_ids);
    var values = [title, tagline, movie_id];

    connection.query('UPDATE Movies SET movie_name = ?, tagline = ? WHERE movie_id = ?', values,
        function(err, result){
            if(err) {
                console.log(this.sql);
                callback(err, null);
            }
            else {
                // delete all the existing genres for the movie first
                DeleteMovieGenres(movie_id, function(err, result) {
                    //then add them back in.
                    AddMovieGenres(movie_id, genre_ids, callback);
                });
            }
        });
}

exports.DeleteById = Delete;