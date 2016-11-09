var express    = require('express');
var bodyParser = require('body-parser');  // get body-parser
var query      = require('pg-query'); 

var router = express.Router();


// on routes that end in /projects
// ----------------------------------------------------
router.route('/:user_id/projects')

  // create a project (accessed at POST http://localhost:8080/projects)
  .post(function(req, res) {
    var user_id = req.params.user_id;
    var project = req.body;
    var keys = project.keys;
    var sql = "insert into projects (owner, fixed, name, description) values ($1, $2, $3, $4) RETURNING *";

    query(sql, [user_id, false, project.name, project.description], function(err, rows) {
      if (err) return res.send(err);

      sql = "update users set project=$1 where id=$2";
      var idProyecto=rows[0].id;
      query(sql, [idProyecto, user_id], function(err, rows) {
          if (err) return res.send(err);
      });
      if(keys.length!=0){
        sql = "insert into project_keywords (project_id, keyword_id) values ";
        for (var i = 0; i < keys.length; i++) {
          var idK = keys[i];
          sql+="("+idProyecto+", "+idK+")";
          if(i<(keys.length-1)) sql+=",";
        }
        console.log(sql);  
        query(sql, [], function(err, rows) {
            if (err) return res.send(err);
        });
      }
      res.json(rows);
    });

  })

  // get all the projects (accessed at GET http://localhost:8080/api/projects)
  .get(function(req, res) {
    var user_id = req.params.user_id;
    var sql = "select * from projects where owner = $1";

    query(sql, [user_id], function(err, rows) {
      if (err) return res.send(err);

      res.json(rows);
    });

  });


route.route('projects')
.get(function(req, res) {
    var user_id = req.params.user_id;
    var sql = "select * from projects where owner = $1";

    query(sql, [user_id], function(err, rows) {
      if (err) return res.send(err);

      res.json(rows);
    });
  });

//ruta de ofertas TODO - probar
route.route('projects/offers')
  //get de las ofertas, proyectos con keywords que cumpla el usuario y con el cual no haya interactuado antes
  .get(function(req, res) {
    var user_id = req.params.user_id;
    var sql = "select distinct p.* from projects p, user_keywords uk, project_keywords pk where "
              +"uk.user_id=$1 and pk.keyword_id=uk.keyword_id and p.id=pk.project_id and "
              +"p.id not in (select project_id from interactions inter where inter.user_id=$1)";

    query(sql, [user_id], function(err, rows) {
      if (err) return res.send(err);

      res.json(rows);
    });
  });

//ruta para la tabla project_keywords
route.route('projects/:project_id/keywords')
  .get(function(req, res) {
    var project_id = req.params.project_id;
    var sql = "select pk.* from projects p, project_keywords pk where "
              +"pk.project_id=$1 and p.id=pk.project_id";

    query(sql, [user_id], function(err, rows) {
      if (err) return res.send(err);

      res.json(rows);
    });

  .post(function(req, res) {
    var idProyecto = req.params.project_id;
    var keys = req.body.keys;
    if(keys.length!=0){
        sql = "insert into project_keywords (project_id, keyword_id) values ";
        for (var i = 0; i < keys.length; i++) {
          var idK = keys[i];
          sql+="("+idProyecto+", "+idK+")";
          if(i<(keys.length-1)) sql+=",";
        }
        console.log(sql);  
        query(sql, [], function(err, rows) {
            if (err) return res.send(err);

            res.json(rows);
        });
    }

  })

  .delete(function(req, res) {
    var idProyecto = req.params.project_id;
    var keys = req.body.keys;
    if(keys.length!=0){
        sql = "delete from project_keywords where ";
        for (var i = 0; i < keys.length; i++) {
          var idK = keys[i];
          sql+="(project_id = "+idProyecto+" AND keyword_id = "+idK+")";
          if(i<(keys.length-1)) sql+=" OR ";
        }
        query(sql, [], function(err, rows) {
            if (err) return res.send(err);

            res.json(rows);
        });
    }

  });

// req.params.project_id
// on routes that end in /projects/:project_id
// ----------------------------------------------------
router.route('/:user_id/projects/fix')

  // get the project with that id
  .put(function(req, res) {
    console.log("inicia");
    var user_id = req.params.user_id;
    var users_id = req.body.users;
    var sql = "update projects set fixed = $1 where owner = $2 RETURNING *";
    console.log("va a mandar "+sql);
    query(sql, [true, user_id], function(err, rows) {
      if (err) console.log("error en query 1");//return res.send(err);
      console.log(rows);
      sql = "update users set project = $1 where id = ";
      var list=[rows[0].id];
      for (var i = 0; i < users_id.length; i++) {
        list.push(users_id[i]);
        sql+="$"+(i+2);
        if(i!=users_id.length-1) sql+=" or id = ";
      }
      console.log("va a mandar "+sql);
      query(sql, list, function(err, rows) {
        if (err) console.log("error en query 2: "+err);//return res.send(err);
        res.json(rows);
      });

    });

    console.log("mando primer sql")
    
    
    console.log("fin");
  })




module.exports = router;