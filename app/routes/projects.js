var express    = require('express');
var bodyParser = require('body-parser');  // get body-parser
var query      = require('pg-query'); 

var router = express.Router();


// on routes that end in /projects
// ----------------------------------------------------
router.route('/')

  // create a project (accessed at POST http://localhost:8080/projects)
  .post(function(req, res) {
    
    res.json({ message: 'Hola' });

  })

  // get all the projects (accessed at GET http://localhost:8080/api/projects)
  .get(function(req, res) {

    var sql = "select * from projects";

    query(sql, [], function(err, rows) {
      if (err) return res.send(err);

      res.json(rows);
    });

  });

// req.params.project_id
// on routes that end in /projects/:project_id
// ----------------------------------------------------
router.route('/:project_id')

  // get the project with that id
  .get(function(req, res) {
    var id = req.params.project_id;


  })

  // update the project with this id
  .put(function(req, res) {
    


  })

  // delete the project with this id
  .delete(function(req, res) {
    


  });

module.exports = router;