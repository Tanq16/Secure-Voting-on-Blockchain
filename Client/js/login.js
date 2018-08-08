// formElement stores the form in the login page
var formElement = document.forms['login'];

// This is an event listener that will be triggered whenever a submit button is clicked
formElement.addEventListener("submit", function(event) {
  var input = $('.validate-input .input100');
  if(!input[0].validity.valid || !input[1].validity.valid) {

    // Normally, the page is reloaded whenever a submit button is clicked.
    // We do not want that to happen as that will clear the error messages.
    event.preventDefault();
  }
});


// This function is called when the user presses the login button
function login(){
  var input = $('.validate-input .input100');
  var valid = true;
  for(var i=0; i<input.length; i++) {
    if(validate(input[i]) == false){
      showValidate(input[i]);
      valid=false;
    }
  };

  // If the input fields are valid, we will send a POST request with the user credentials to the server.
  if(valid) {

    // Set up HTTP Request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://10.30.26.212:5000/api/login");

    // Our web server is hosted on port 8000 while the APIs are on port 5000.
    // Setting withCredentials to true will enable Cross Origin Resource Sharing (CORS).
    // We will need CORS to set cookies on the client side directly from the server side.
    xhr.withCredentials = true;

    // The POST data is being sent as a urlencoded form.
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Call a function when the state changes.
    xhr.onreadystatechange = function() {

      // Do something if the request has been processed and a response has been received
      if(xhr.readyState == XMLHttpRequest.DONE) {

        // Status code of 200 corresponds to successful login.
        // We will replace the contents of the login HTML page with that of the voting page.
        if(xhr.status == 200) {
          document.write(xhr.responseText);
        }

        // Status code of 201 corresponds to unsuccessful login (incorrect username/password).
        // We will display an error message in this case.
        else if(xhr.status == 201) {
          var elem = document.getElementById("errorMsg");
          elem.innerHTML = xhr.responseText;
          elem.style.display = 'inline';
        }
      }
    }

    // Send POST data in url encoded format
    xhr.send("id=" + $(input[0]).val()+ "&password=" + $(input[1]).val());
  }

};


// Helper to check if input is valid
function validate (input) {
  if($(input).attr('type') == 'id' || $(input).attr('name') == 'id') {
    // Username should be like f20150999
    if($(input).val().trim().match(/^(f201[0-9]{5})$/) == null) {
      return false;
    }
  }
  else {
    // Password field should not be blank
    if($(input).val().trim() == ''){
      return false;
    }
  }
};

// Displays validation error message
function showValidate(input) {
  var thisAlert = $(input).parent();
  $(thisAlert).addClass('alert-validate');
};

// Hides validation error message
function hideValidate(input) {
  var thisAlert = $(input).parent();
  $(thisAlert).removeClass('alert-validate');
};
