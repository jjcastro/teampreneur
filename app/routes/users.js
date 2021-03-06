var express    = require('express');
var bodyParser = require('body-parser');  // get body-parser
var query      = require('pg-query'); 
var bcrypt     = require('bcrypt-nodejs');
var jwt        = require('jsonwebtoken');

var router = express.Router();

// on routes that end in /users
// ----------------------------------------------------
router.route('/')

  // create a user (accessed at POST http://localhost:8080/users)
  .post(function(req, res) {
    
    var params = req.body;
    var keys = params.keys;
    var sql = "insert into users (name,email,image_link,phone,password) values ($1,$2,$3,$4,$5) RETURNING *";

    var args = [
      params.name,
      params.email,
      params.image_link,
      params.phone,
      bcrypt.hashSync(params.password)
    ];

    query(sql, args, function(err, rows) {
      if (err) return res.send(err);
      console.log(rows);
      if(keys.length!=0){
      var idUser = rows[0].id;
      var sql2 = "insert into user_keywords (user_id,keyword_id) values "
      for(var i = 0; i<keys.length; i++)
      {
        var id_keyword = keys[i];
        sql2+="("+idUser+","+id_keyword+")";
        if(i!= keys.length-1)
          {
            sql2+=",";
          }
      }
      console.log(sql2);
    query(sql2, [], function(err, rows) {
      if (err) return res.send(err);
      console.log(rows);
      res.json(rows);
     });
  }
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

module.exports = router;