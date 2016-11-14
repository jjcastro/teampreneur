var express    = require('express');
var bodyParser = require('body-parser');  // get body-parser
var query      = require('pg-query'); 
//var teamBuilder = require('../../bestTeam');

var router = express.Router();


// on routes that end in /personality
// ----------------------------------------------------
router.route('/')

  // add personality of a user (accessed at POST http://localhost:8080/api/personality)
  .post(function(req, res) {
    var user_id = req.decoded.id;
    var v = req.body;
    var args = [user_id];
    args.push(v.e);
    args.push(v.a);
    args.push(v.c);
    args.push(v.n);
    args.push(v.o);
    var sql = "insert into personality (user_id, extraversion, agreeableness, conscientiousness, neuroticism, openness_to_experience) values ($1, $2, $3, $4, $5, $6) RETURNING *";

    query(sql, args, function(err, rows) {
      if (err) return res.send(err);

      res.json(rows);
    });

  })

  // get the personality of a user (accessed at GET http://localhost:8080/api/projects)
  .get(function(req, res) {
    var user_id = req.decoded.id;
    var sql = "select * from personality where user_id = $1";

    query(sql, [user_id], function(err, rows) {
      if (err) return res.send(err);

      res.json(rows);
    });

  });


module.exports = router;