var express    = require('express');
var bodyParser = require('body-parser'); 	// get body-parser
var query      = require('pg-query'); 
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcrypt-nodejs');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

var apiRouter = express.Router();

// test route to make sure everything is working 
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// route to authenticate a user (POST http://localhost:8080/api/auth)
// ----------------------------------------------------
apiRouter.post('/auth', function(req, res) {

  var sql = 'SELECT * FROM users WHERE email = $1';
    
  query.first(sql, req.body.email, function(err, user) {
    if (err) return res.send(err);

    if (!user) {
      res.json({ 
        success: false, 
        message: 'Authentication failed. User not found.' 
      });
    } else if (user) {

      // check if password matches
      var validPassword = bcrypt.compareSync(req.body.password, user.password);

      if (!validPassword) {
        res.json({ 
          success: false, 
          message: 'Authentication failed. Wrong password.' 
        });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign({
          id: user.id,
          name: user.name,
          email: user.email
        }, superSecret, {
          expiresIn: "2 days" // expires in 2 days
                              // this is using a rauchg/ms time span
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   
    }
  });
});

// route middleware to verify a token
var middleware = function(req, res, next) {
  // do logging
  console.log('Somebody just came to our app!');

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {      

      if (err) {

        console.log(err);

        res.status(403).send({ 
          success: false, 
          message: 'Failed to authenticate token.' 
        });      
      } else { 
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        // console.log(decoded);
            
        next(); // make sure we go to the next routes and don't stop here
      }
    });

  } else {

    // if there is no token
    // return an HTTP response of 403 (access forbidden) and an error message
    res.status(403).send({ 
      success: false, 
      message: 'No token provided.' 
    });
    
  }
};

apiRouter.use('/me',       middleware, require('./me'));
apiRouter.use('/projects', middleware, require('./projects'));
apiRouter.use('/users',    middleware, require('./users'));
apiRouter.use('/keywords', middleware, require('./keywords'));
apiRouter.use('/questions', middleware, require('./questions'));
apiRouter.use('/personality', middleware, require('./personality'));

module.exports = apiRouter;