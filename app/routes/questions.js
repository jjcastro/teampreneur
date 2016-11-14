var express    = require('express');
var bodyParser = require('body-parser');  // get body-parser
var query      = require('pg-query'); 

var router = express.Router();


// on routes that end in /questions
// ----------------------------------------------------
router.route('/')

  // get all the users (accessed at GET http://localhost:8080/api/users)
  .get(function(req, res) {

    var sql = "select * from questions";

    query(sql, [], function(err, rows) {
      if (err) return res.send(err);
      
      res.json(rows);
    });

  });


module.exports = router;