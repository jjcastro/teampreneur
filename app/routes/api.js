var express    = require('express');
var bodyParser = require('body-parser'); 	// get body-parser
var query      = require('pg-query'); 

var apiRouter = express.Router();

// test route to make sure everything is working 
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

apiRouter.use('/users', require('./users'));
apiRouter.use('/projects', require('./projects'));

module.exports = apiRouter;