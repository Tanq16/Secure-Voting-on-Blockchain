// Import required libraries
var mysql      = require('mysql');
var voting     = require('./../voting');
var cookieParser = require('cookie-parser');

// Create connection to MySQL database with given details
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Rasgulla*123',
  database : 'Votechain'
});

// Connect to MySQL Database
connection.connect(function(err) {
  if(!err) {
    console.log("Database is connected ... nn");
  } else {
    console.log("Error connecting database ... nn");
  }
});

// Define the vote function
// req is the HTTP request
// res is the HTTP response
exports.vote = function(req,res) {

  // Get selected candidates' names from POST request
  // req.body requires the body-parser library which has been included in server.js
  var presidentName= req.body.president;
  var vicePresidentName = req.body.vicepresident;

  // Get cookie
  var id = req.signedCookies.UserID;

  // Check if cookie exists and has not been tampered.
  if(id === undefined) { // Does not exist or tampered
    res.status(401).send('Please login first');
  }
  else { // Cookie is OK

    // Get ethereum address of user
    connection.query('SELECT ethereum_address FROM users WHERE id = ?',[id], function (error, results, fields) {
      if (error) {
        res.status(400).send("Error occurred during databse query");
      }
      else { // address found
        if(results.length > 0) {
          addr = results[0].ethereum_address;

          // Call voting function
          var code = voting.voteForCandidates(addr, presidentName, vicePresidentName);

          // Clear cookie -> Logs user out
          res.clearCookie("UserID");
          res.sendStatus(code);
        }
        else { // not found
          res.status(403).send("ID not found");
        }
      }
    });
  }
}
