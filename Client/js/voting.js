// This function is called when the user presses the login button
function vote(){

  // Get names of selected candidates
  presidentName = document.querySelector('input[name="president"]:checked').value;
  vicePresidentName = document.querySelector('input[name="vicepresident"]:checked').value;

  // Request user to confirm selection
  confirmed = confirm("Confirm your votes\nPresident: " + presidentName + "\nVice President: " + vicePresidentName);

  // If user confirms, send POST request
  if(confirmed) {

    // Set up HTTP Request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://10.30.26.212:5000/api/vote");

    // Our web server is hosted on port 8000 while the APIs are on port 5000.
    // Setting withCredentials to true will enable Cross Origin Resource Sharing (CORS).
    // We will need CORS to set cookies on the client side directly from the server side.
    xhr.withCredentials = true;

    // The POST data is being sent as a urlencoded form.
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Call a function when the state changes.
    xhr.onreadystatechange = function() {

      // Status code 200 corresponds to successful vote.
      if(xhr.readyState == XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
          alert("Your vote has been recorded.");
        }

        // Status code 201 is returned when the user has already voted.
        else if(xhr.status == 201) {
          alert("You have already voted.");
        }

        // Status code 401 is returned if the user is not logged in.
        // Likely to happen if the session cookie has expired.
        else if(xhr.status == 401) {
          alert('Please login first.');
        }

        // Status code 401 is returned if the user tries to modify the cookie
        else if(xhr.status == 403) {
          alert("You tampered the cookie.");
        }

        // Reloading the window will log the user out and take them to the home page.
        window.location.reload();
      }
    }

    // Send POST data in url encoded format
    xhr.send("president=" + presidentName + "&vicepresident=" + vicePresidentName);
  }

};
