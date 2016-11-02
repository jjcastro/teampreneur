var express    = require('express');
var bodyParser = require('body-parser');  // get body-parser
var query      = require('pg-query'); 

var router = express.Router();


// on routes that end in /users
// ----------------------------------------------------
router.route('/')

  // create a user (accessed at POST http://localhost:8080/users)
  .post(function(req, res) {
    
    

  })

  // get all the users (accessed at GET http://localhost:8080/api/users)
  .get(function(req, res) {

    var sql = "select * from users";

    query(sql, [], function(err, rows) {
      if (err) return res.send(err);

      res.json(rows);
    });

  });

// req.params.user_id
// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/:user_id')

  // get the user with that id
  .get(function(req, res) {
    


  })

  // update the user with this id
  .put(function(req, res) {
    


  })

  // delete the user with this id
  .delete(function(req, res) {
    


  });

module.exports = router;