var express    = require('express');
var bodyParser = require('body-parser');  // get body-parser
var query      = require('pg-query'); 
var teamBuilder = require('../../bestTeam');

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


router.route('/:project_id/team')
	.get(function(req, res){
		var user_id = req.decoded.id;
		var others = req.body.users;
		var project_id = req.params.project_id;
		var keyWordsRequeridos = getProjectKeywords(project_id);
		if(!others){
			others = [];
			var sql = "select user_id from user_keywords uk where not uk.user_id=$1 and uk.keyword_id in "
					+" (select uk.keyword_id from user_keywords uk where uk.user_id=$1)"
					+" and uk.user_id not in (select inte.user_id from interaction inte where inte.project_id=$2)";
			query(sql, [user_id, project_id], function(err, rows){
				if(err) return res.send(err);

				for (var i = 0; i < rows.le;ngth; i++) {
					var id = rows[i].user_id;
					others.push(id);
				}
			});
		}
		var args=[user_id];
		var sql = "select * from personality where user_id = $1";
		for (var i = 0; i < others.length; i++) {
			sql+=" or user_id = $"+(i+2);
			args.push(others[i]);
		}
		query(sql, args, function(err, rows){
			if(err) return res.send(err);
			var lista = [];
			for (var i = 0; i < rows.length; i++) {
				var p = rows[i]
				var listaUsuario = [p.user_id, p.extraversion, p.agreeableness, p.conscientiousness, p.neuroticism, p.openness_to_experience];
				listaUsuario.push(getUserKeywords(p.user_id));
				lista.push(listaUsuario);
			}
			var tb = new TeamBuilder(lista,keyWordsRequeridos);
			var equipo = tb.getBestTeam();
			var sql2 = "select id, name, phone,  from users where ";
			args=[];
			for (var i = 0; i < equipo.length; i++) {
				if(i==0) sql2+=" id = $"+(i+1);
				else sql2+=" or id = $"+(i+1);
				args.push(equipo[i]);
			}
			query(sql2, args, function(err, rows){
				if(err) return res.send(err);
					res.json(rows);
			});
		});

	});


var getUserKeywords = function(id){
	var sql = "select k.name from keywords k, user_keywords uk where uk.user_id=$1 and k.id=uk.keyword_id";
	var ans = [];
	query(sql, [id], function(err, rows){
		if(err) console.log("error");
		for (var i = 0; i < rows.length; i++) {
			var kw = rows[i]
			ans.push(kw.name);
		}
	});
	return ans;
};

var getProjectKeywords = function(id){
	var sql = "select k.name from keywords k, project_keywords uk where uk.project_id=$1 and k.id=uk.keyword_id";
	var ans = [];
	query(sql, [id], function(err, rows){
		if(err) console.log("error");
		for (var i = 0; i < rows.length; i++) {
			var kw = rows[i]
			ans.push(kw.name);
		}
	});
	return ans;
};
/*
var listaPrueba = [
[1,35,25,15,10,36,["Java","HTML"]],
[2,32,29,12,19,32,["Java","Angular"]],
[3,15,35,25,15,26,["Javasript","HTML"]],
[4,34,24,11,20,33,["Java","CSS"]],
[5,15,35,35,12,33,["Finanzas","HTML"]],
[6,27,24,29,30,16,["Java","Finanzas"]]
];
*/

module.exports = router;