var express = require('express');
var router = express.Router();
var UserDal = require('../model/user_dal');
var accountDal = require('../model/account_dal');

/* GET users listing. */
router.get('/all', function(req, res, next) {
  UserDal.GetAll(function (err, result){
    if(err) throw err;
    res.render('displayAllUsers.ejs', {rs: result})
  });
});

router.get('/', function (req, res) {
  UserDal.GetByID(req.query.user_name, function (err, result) {
        if (err) throw err;

        res.render('displayUserRatings.ejs', {rs: result, user_name: req.query.user_name});
      }
  );
});

router.get('/create', function(req, res, next) {
    res.render('userFormCreate.ejs');
});


router.get('/save', function(req, res, next) {
    console.log("first_name equals: " + req.query.first_name);
    console.log("the last_name submitted was: " + req.query.last_name);
    console.log("the email submitted was:" + req.query.email);
    console.log("the password submitted was:" + req.query.password);
    accountDal.Insert(req.query, function(err, result){
        if (err) {
            res.send(err);
        }
        else {
            res.send("Successfully saved the user.");
        }
    });
});

module.exports = router;



