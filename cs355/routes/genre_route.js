var express = require('express');
var router = express.Router();
var genreDal = require('../model/genre_dal');


router.get('genre/new', function(req, res) {
    res.render('genre/genre_insert_form');
});

router.get('genre/genre_insert', function(req, res){
    genreDal.Insert(req.query.genre_name, function(err, result){
        var response = {};
        if(err) {
            response.message = err.message;
        }
        else {
            response.message = 'Success!';
        }
        res.json(response);
    });
});


module.exports = router;