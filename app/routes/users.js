var express    = require('express');
var bodyParser = require('body-parser');  // get body-parser
var query      = require('pg-query'); 

var router = express.Router();


// on routes that end in /users
// ----------------------------------------------------
router.route('/')

  // create a user (accessed at POST http://localhost:8080/users)
  .post(function(req, res) {
    
    var params = req.body;
    var sql = "insert into users (name,email,image_link,phone) values ($1,$2,$3,$4) RETURNING *"
    query(sql, [params.name,params.email,params.image_link,params.phone], function(err, rows) {
      if (err) return res.send(err);
      console.log(rows);
      res.json(rows);
    });


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
    
    var params = req.body;
    var sql = "update users set name=$1,email=$2,image_link=$3,phone=$4 where id=$5 RETURNING *"
    query(sql, [params.name,params.email,params.image_link,params.phone,req.params.user_id], function(err, rows) {
      if (err) return res.send(err);
      console.log(rows);
      res.json(rows);
    });

  })

  // delete the user with this id
  .delete(function(req, res) {
    


  });


router.use('/', require('./projects'));

module.exports = router;