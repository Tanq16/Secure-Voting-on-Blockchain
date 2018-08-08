# Report for crypto

---

## Setup
To setup the complete web app following steps are used -
1. Install nodejs and npm. Install all nodejs dependencies by running the command `npm install`.
2.
3. Run ganache and give a 12-word mnemonic to generate accounts on the blockchain -> `node_modules/.bin/ganache-cli -m "<<>>"`
   Always use same mnemonic.
   e.g. "sorry tragic airport arrive tortoise notice toast mad error aware bleak chronic"
4. Run the file **run.js** on the node interpreter and on the second last line, get the address of the deployed blockchain which is given as a parameter to the function in the 6th line of 'Voting.js' in the main folder.
5. Start **server.js** on the server by running `nodemon server.js`.
6. Run `python ../http-server.py` from inside the **Client/** folder to serve the pages in that folder to the client that connects.


## Usage
The web application is structured in a way such that once all serving components are enabled in the back end, the client is served a login page which accepts a userID and a password, given to the client prior to the voting process.
The client side credentials are then sent to the server side as a post request over SSL. The backend then sends an acknowledgement of a successful login attempt and grants a cookie for each login. Already existing cookies are cleared before the login process proceeds as a security mechanism.
After a successful login a different html page is overwritten on the existing page. This page has selection of the candidates that need to be voted. The results of the voted candidates are again posted over SSL and the backend processes the votes by interacting with the blockchain instance running on the server.

## Login
### Front End
### Back End

***

## Voting
### Front End

The front end has two parts - login and voting. voting.html is not directly accessible. Rather, its contents are returned upon a successful login and are then overwritten on the existing index.html page.
In login part's html, the credentials have constraints given as a regex in the html itself as `pattern="f201\d{5}"` for ID and `pattern=".+"` for password. The `data-validate` part denotes the message that is displayed when the  pattern for the required field is not matched.
```javascript
function sendPost() {
    var input = $('.validate-input .input100');
    var valid = true;
    for(var i=0; i<input.length; i++) {
        if(validate(input[i]) == false){
            showValidate(input[i]);
            valid=false;
        }
    };
    if(valid) {
      // ................................
    }
    // ................................
};
```
The above function sendPost() is called when the form is submitted which also calls validate and showValidate functions in its body. These functions show the error when the patterns specified are not matched. However, this also reloads the page and removes the already entered values(incorrect pattern) from the field. Therefore, the snippet -
```js
var e = document.forms['login'];
e.addEventListener("submit", function(event) {
  var input = $('.validate-input .input100');
  if(!input[0].validity.valid || !input[1].validity.valid) {
    event.preventDefault();
  }
});
```
is used to prevent the default action in case the input does not match the specified pattern, the default action being the reload. If all the validity checks are passed then the credentials are sent as a post request using XMLHttpRequest.

### Back End

***

## server and api
The server has a service running on port 5000 which essentially is a service that routes client requests to required service response mechanisms running elsewhere on the server based on the called api.
```js
var app = express();
var router = express.Router();
router.post('/login',login.login)
router.post('/vote', vote.vote)
app.use('/api', router);
```
The first line declares an object of express app. The second line declares a routing middleware for managing routes.
The router.post lines specify where the requests are to be routed depending on the request parameters.
app.use statements pile up and make all the specified calls available for the router to respond to.

The cert options parameters are given to ensure the network exchange over SSL. body parser and cookie parser are used to read and parse the urlencoded data and the cookie. Helmet adds security headers to requests (discussed in security section). The complete code for server.js is available in snippets section.

The two routes that are called in the course of the functioning of the webapp are - loginroutes and voteroutes.
The initial connection block is the connection to the sql database. The exports.xxx is the function that is called with regard to the respective api.
```js
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Rasgulla*123',
  database : 'Votechain'
});
```

The exports.login function clears existing cookies(if any). It then query's the database with the id and password in the post request. res.cookie sends a cookie in the response with the given headers. Then it writes the contents of the voting.html file in the reply body. Corresponding error messages and status codes are also sent if the conditions are met, as described in the code given under snippets section.
```js
// ...................
res.clearCookie("UserID");
var id= req.body.id;
var password = req.body.password;
// ...................
connection.query('SELECT * FROM users WHERE id = ?',[id], function (error, results, fields) {
  if (error) {
    res.status(400).send("Error occurred during databse query");
  }
  else {
    if(results.length > 0) {
      if(results[0].password == password) {
        res.status = 200;
        res.cookie('UserID', id, { maxAge: 120000, httpOnly: true, signed: true, secure: true});
        console.log('cookie created successfully');
        res.setHeader('Content-type', 'text/html');
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
```

The exports.vote is the function that is called by the voting page. It also connects to the sql database and receives the president and vice president names in the request body. The signed cookie is verified and the corresponding id is taken to retrieve the ethereum address of the user. If valid ethereum address is returned in the query result, then the voting function is called from the voting.js code present in the main folder. This script interacts directly with the blockchain where the voted candidates' data reflect an appropriate change. Also, corresponding error messages and status codes are also sent if the conditions are met as described in the code under the snippets section.
```js
// ....................
var id = req.signedCookies.UserID;
// ....................
connection.query('SELECT ethereum_address FROM users WHERE id = ?',[id], function (error, results, fields) {
  if (error) {
    res.status(400).send("Error occurred during databse query");
  }
  else {
    if(results.length > 0) {
      console.log(id);
      addr = results[0].ethereum_address;
      var code = voting.voteForCandidates(addr, presidentName, vicePresidentName);
      res.clearCookie("UserID");
      res.sendStatus(code);
    }
    else {
      res.status(403).send("ID not found");
    }
  }
});
```

## security
From the security point of view, three mechanisms are considered. They are - helmet, cookies and SSL.
SSL is added to make the channel of communication encrypted such that all data is transferred over https.
Self signed certificates are used which are present in the `cert/` folder. The procedure of creating a self signed certificate is described in the install notes.
The web page is served from an https server implemented as a module in python. The code used for this is -
```python
import http.server, ssl
server_address = ('', 8000)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               server_side=True,
                               certfile='../cert/server.pem',
                               ssl_version=ssl.PROTOCOL_TLSv1)
httpd.serve_forever()
```
The certificate file is given as an argument to the httpd object. This script is executed from inside the `Client/` folder so that the html file in that folder is used to serve the client.
The server file also has the certificate options to exchange data only over SSL on port 5000.
```js
var certOptions = {
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.crt')
};
var server = https.createServer(certOptions, app).listen(5000);
```

Cookies play a very important role in the application. They help authenticate the user as well as make sure a session is not hijacked. The cookies have several parameters out of which the `secure` parameter is set to true to enable the functioning of the cookies over SSL, the `httponly` parameter is set to true so that no client side javascript code can modify the cookie or read it using `document.read()`. The cookie is also signed using a secret key such that any adversary is unable to generate a valid cookie, signature pair; thus the `signed` parameter is also set to true.
The cookie is also cleared at the time of login before any authentication procedure processing to ensure no predefined cookie by the same name exists. This also rules out the possibility of an attacker copying a cookie and trying logging in again. If the credentials are valid and authentication procedure passes, then a new cookie is generated from the server side and is sent back to the client along with the text of the voting page which is then rendered on the client side. This is performed by the following snippet.
```js
// ........................
if(results.length > 0) {
  if(results[0].password == password) {
    res.status = 200;
    res.cookie('UserID', id, { maxAge: 120000, httpOnly: true, signed: true, secure: true});
    console.log('cookie created successfully');
    res.setHeader('Content-type', 'text/html');
    voting = fs.readFileSync('/Users/Shaleen/blockchain_voting/voting.html');
    res.write(voting);
    res.end();
  }
  // .......................
}
// ........................
```
The cookie also has a max lifetime to emulate proper flow of voting channels. Once this time period is over, the cookie becomes invalid and thus cannot be used for authentication. This is set using the maxAge paramete as shown in the above snippet.

The cookie is preserved on the voting page when it is overwritten on the existing page and is used for further authentication before casting a vote. When the `vote` api receives the post request of the chosen candidates, the cookie is also sent along in the XMLHttpRequest. The api then reads the cookie using the same secret that was used to sign it. The data that is signed is the id of the vote caster. The id is then retrieved after verifying the signature and is used to query the database to retrieve the ethereum address, which in turn is used to record the casted vote. After the vote casting procedure is complete, the cookie is then cleared from the client side and the page reloads giving the login page again. The cookie check and the clearing takes place in the following snippet -
```js
// .......................
var id = req.signedCookies.UserID;
// .......................
// .......................
if(results.length > 0) {
  console.log(id);
  addr = results[0].ethereum_address;
  var code = voting.voteForCandidates(addr, presidentName, vicePresidentName);
  res.clearCookie("UserID");
  res.sendStatus(code);
}
// .......................
```

Helmet is also used in the application to add security related headers to all network activity. Helmet is actually just a collection of nine smaller middleware functions that set security-related HTTP headers:
1. `csp` sets the Content-Security-Policy header to help prevent cross-site scripting attacks and other cross-site injections.
2. `hidePoweredBy` removes the X-Powered-By header.
3. `hpkp` Adds Public Key Pinning headers to prevent man-in-the-middle attacks with forged certificates.
4. `hsts` sets Strict-Transport-Security header that enforces secure (HTTP over SSL/TLS) connections to the server.
5. `ieNoOpen` sets X-Download-Options for IE8+.
6. `noCache` sets Cache-Control and Pragma headers to disable client-side caching.
7. `noSniff` sets X-Content-Type-Options to prevent browsers from MIME-sniffing a response away from the declared content-type.
8. `frameguard` sets the X-Frame-Options header to provide clickjacking protection.
9. `xssFilter` sets X-XSS-Protection to enable the Cross-site scripting (XSS) filter in most recent web browsers.

Helmet can be used by following code -
```js
var helmet = require('helmet');
app.use(helmet());
```

SQL injection is also prevented for any interactions with the sql database. This is done by parameterized sql query -

```js
connection.query('SELECT * FROM users WHERE id = ?',[id], function (error, results, fields) {});
```
The `?` is replaced by the exact string that is entered by the user, therefore no special character interpretation works, instead the exact input is used as it is for the query. This prevents SQL injection attacks.
