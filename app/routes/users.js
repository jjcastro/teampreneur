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
    var keys = params.keys;
    var sql = "insert into users (name,email,image_link,phone) values ($1,$2,$3,$4) RETURNING *"
    query(sql, [params.name,params.email,params.image_link,params.phone], function(err, rows) {
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
  router.route('/:user_id/keywords')

    .get(function(req,res){
      var user_id=req.params.user_id;
      var sql = "select k.* from user_keywords u, keywords k where u.user_id=$1 and "
                +"u.keyword_id=k.id ";
      query(sql,[user_id], function(err, rows){
        if (err) console.log(err);//return res.send(err);
        res.json(rows);
      })
    })
    
    .post(function(req, res) {
    var idUser = req.body.user_id;
    var params = req.body;
    var keys = params.keys;
    if(keys.length!=0){
    var sql = "insert into user_keywords (user_id,keyword_id)values";

    for(var i = 0; i<keys.length; i++)
      {
        var id_keyword = keys[i];
        sql+="("+idUser+","+id_keyword+")";
        if(i!= keys.length-1)
          {
            sql+=",";
          }
      }
    query(sql, [], function(err, rows) {
      if (err) return res.send(err);
      res.json(rows);
    });
    }


  });


router.use('/', require('./projects'));

module.exports = router;