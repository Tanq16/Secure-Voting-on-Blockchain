// Import required libraries
mysql        = require('mysql');
cookieParser = require('cookie-parser');
fs           = require('fs')

// Create connection to MySQL database with given details
var connection   = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Rasgulla*123',
  database : 'Votechain'
});

// Connect to MySQL Database
connection.connect(function(err) {
  if(!err) {
    console.log("Database is connected...");
  }
  else {
    console.log("Error connecting database");
  }
});

// Define the login function
// req is the HTTP request
// res is the HTTP response
exports.login = function(req,res) {

  // Clear existing cookie
  res.clearCookie("UserID");

  // Get username and password from POST request
  // req.body requires the body-parser library which has been included in server.js
  var id = req.body.id;
  var password = req.body.password;

  // SQL query to fetch account with matching username
  connection.query('SELECT * FROM users WHERE id = ?',[id], function (error, results, fields) {
    if (error) {
      res.status(400).send("Error occurred during databse query");
    }
    else {
      if(results.length > 0) {

        // Match submitted password with that in database
        if(results[0].password == password) {
          res.status = 200; // Success OK

          // Set the cookie
          // maxAge: duration after which cookie will expire (in ms)
          // Cookie will be alive for 2 minutes only.
          // Cookie is HttpOnly. It cannot be modified by any client side application
          // Cookie will be signed and sent along with its HMAC
          // Secure cookies can only be written to HTTPS sites

          res.cookie('UserID', id, { maxAge: 120000, httpOnly: true, signed: true, secure: true});
          console.log('cookie created successfully');
          res.setHeader('Content-type', 'text/html');

          // Read the voting HTML page and write it to the response.
          voting = fs.readFileSync('/Users/Shaleen/blockchain_voting/voting.html');
          res.write(voting);
          res.end();
        }
        else {
          res.status(201).send("ID and Password do not match");
        }
      }
      else {
        res.status(201).send("ID not found");
      }
    }
  });
}
