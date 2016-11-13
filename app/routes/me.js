var express = require('express');
var query   = require('pg-query');
var bcrypt  = require('bcrypt-nodejs');

var router = express.Router();

// on routes that end in /users/me
// ----------------------------------------------------
router.route('/')
  .get(function(req, res) {

    var sql = 'SELECT id, name, email FROM users WHERE email = $1';
    
    query.first(sql, req.decoded.email, function(err, rows) {
      if (err) res.send(err);
      // return that user
      res.json(rows);
    });
  })

  .put(function(req, res) {
    
    var params = req.body;
    var sql = "update users set name=$1,email=$2,image_link=$3,phone=$4 where id=$5 RETURNING *"
    query(sql, [params.name,params.email,params.image_link,params.phone,req.params.user_id], function(err, rows) {
      if (err) return res.send(err);
      console.log(rows);
      res.json(rows);
    });

  });

// req.params.user_id
// on routes that end in /users/:user_id
// ----------------------------------------------------

router.route('/keywords')

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

module.exports = router;