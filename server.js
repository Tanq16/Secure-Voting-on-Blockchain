// Import required libraries
var express      = require("express");
var login        = require('./routes/loginroutes');
var vote         = require('./routes/voteroutes')
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var https        = require('https');
var fs           = require('fs');
var helmet       = require('helmet');

var app = express();

// Set up body parser to read url encoded forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add Cross Origin Resource Sharing (CORS) headers
app.use(function(req, res, next) {
  // Only allow requests originating from given URI
  res.header("Access-Control-Allow-Origin", "https://10.30.26.212:8000");

  // Only allow requests with given headers
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Allow requests with withCredentials set to true
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Adds security to head(ers)
app.use(helmet());

// Secret key for signing cookies
app.use(cookieParser("jewnf;ehfr12u93u8912u309&(Y*802w3) 193urfnjeksoiqhrqh0rh"));

// route to handle api calls
var router = express.Router();
router.post('/login',login.login)
router.post('/vote', vote.vote)
app.use('/api', router);

// Load server's digital certificate
var certOptions = {
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.crt')
};

// Start HTTPS server
var server = https.createServer(certOptions, app).listen(5000);
