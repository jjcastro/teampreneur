var express = require('express');
var query   = require('pg-query');
var bcrypt  = require('bcrypt-nodejs');

var router = express.Router();

// on routes that end in /users/me
// ----------------------------------------------------
router.get('/', function(req, res) {

  var sql = 'SELECT id, name, email FROM users WHERE email = $1';
  
  query.first(sql, req.decoded.email, function(err, rows) {
    if (err) res.send(err);
    // return that user
    res.json(rows);
  });
});

module.exports = router;