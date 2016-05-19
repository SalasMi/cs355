var express = require('express');
var router = express.Router();
var accountDAL = require('../model/account_dal');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CS355', subtitle:'Lab 8' });
});

/* Get Template Example */


module.exports = router;

router.get('/authenticate', function(req, res) {
  accountDAL.GetByEmail(req.query.email, req.query.password, function (err, account) {
    if (err) {
      res.send(err);
    }
    else if (account == null) {
      res.send("Account not found.");
    }
    else {
      req.session.account = account;
     //res.send(account);
     res.redirect('/welcome');
    }
    
  });
});

router.get('/login', function(req, res) {
  res.render('authentication/login.ejs');

});


router.get('/', function(req, res, next) {
  var data = {
    title : 'Express'
  }
  if(req.session.account === undefined) {
    res.render('index', data);
  }
  else {
    data.first_name = req.session.account.first_name;
    res.render('index', data);
  }
});

router.get('/welcome', function(req, res, next) {
  var data = {
    title : 'Express'
  }
  if(req.session.account === undefined) {
    res.render('welcome', data);
  }
  else {
    data.first_name = req.session.account.first_name;
    res.render('welcome', data);
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy( function(err) {
    res.render('authentication/logout.ejs');
  });
});


