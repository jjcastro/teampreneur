var express = require('express');
var query   = require('pg-query');
var bcrypt  = require('bcrypt-nodejs');

var router = express.Router();

// on routes that end in /users/me
// ----------------------------------------------------
router.route('/')
  .get(function(req, res) {

    var sql = 'SELECT id, name, occupation, email, image_link, phone FROM users WHERE email = $1';
    
    query.first(sql, req.decoded.email, function(err, rows) {
      if (err) res.send(err);
      // return that user
      res.json(rows);
    });
  })

  .put(function(req, res) {
    
    var params = req.body;
    // console.log(params);
    var sql = "update users set name=$1,image_link=$2,phone=$3,occupation=$4 where id=$5 RETURNING *";
    query(sql,
      [
        params.name,
        params.image_link,
        params.phone,
        params.occupation,
        req.decoded.id
      ],
      function(err, rows) {
      if (err) return res.send(err);
      res.json({
        success: true,
        message: 'User updated!'
      });
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