    // Function to check if the user is already logged in
    function checkLoggedIn() {
      const isAdminLogin = localStorage.getItem('isAdminLogin');
      const accessCode = localStorage.getItem('accessCode');

      if (isAdminLogin && accessCode) {
          // alert('You are already logged in as admin.');
          return true;
      } else {
          return false;
      }
  }

  // Function to log the user out
  function logoutUser() {
      localStorage.removeItem('isAdminLogin');
      localStorage.removeItem('accessCode');
      alert('You have been logged out.');
      location.href = "../admin/login.html"
  }

  // Function to check if the login has expired
  function checkLoginExpiration() {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
          const currentTime = new Date().getTime();
          const elapsedTime = currentTime - parseInt(loginTime);

          // 30 minutes in milliseconds
          const thirtyMinutes = 30 * 60 * 1000;

          if (elapsedTime >= thirtyMinutes) {
              // Logout the user if the login has expired
              logoutUser();
          }
      }
  }

  // Check if the user is already logged in
  if (checkLoggedIn()) {
      // Check the login expiration if the user is logged in
      checkLoginExpiration();
  } else {
      // Prompt the user to enter the access code
      const promptAccess = prompt('Enter your access code:');

      // Check if the user clicked "Cancel" or didn't enter any code
      if (promptAccess !== null && promptAccess !== '') {
          // Validate the access code
          checkAccessCode(promptAccess);
      } else {
          // User clicked "Cancel" or didn't enter any code
          alert('Access code prompt canceled or empty.');
          location.href = "login.html"
      }
  }

  // Function to check if the prompted access code is valid
  function checkAccessCode(promptedAccess) {
      const validAccessCodes = ['12476', '18956', '09582', '67854'];

      if (validAccessCodes.includes(promptedAccess)) {
          // Access code is valid, log the user in
          localStorage.setItem('isAdminLogin', true);
          localStorage.setItem('accessCode', promptedAccess);

          // Store the login time in localStorage
          localStorage.setItem('loginTime', new Date().getTime());

          alert('You are now logged in as admin.');

          // Set a timer to logout the user after 30 minutes
          setTimeout(logoutUser, 30 * 60 * 1000);
      } else {
          // Access code is incorrect
          alert('Your access code is incorrect. Please try again.');
      }
  }

let server = "http://localhost/duc/backend"

// Function to get the value of a specific GET parameter
function getQueryParam(parameterName) {
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  return urlParams.get(parameterName);
}

// Usage
let paramValue = getQueryParam("page");

if (paramValue) {
  document.getElementById(paramValue).classList.add("active");
  $(document).ready(function () {
    setTimeout(() => {
      $("#mainContainer").load(
        `${paramValue}.html`,
        function (response, status, xhr) {
          if (status === "error") {
            // Handle the error here
            $("#mainContainer").html(
              '<h2 class="text-danger text-center mt-4">Sorry, the page was not found.</h2>'
            );
          }
        }
      );
    }, 500);
  });
} else {
  document.getElementById("dashboard").classList.add("active");
  $(document).ready(function () {
    setTimeout(() => {
      $("#mainContainer").load(
        "dashboard.html",
        function (response, status, xhr) {
          if (status === "error") {
            // Handle the error here
            $("#mainContainer").html(
              '<h2 class="text-danger text-center mt-4">Sorry, the page was not found.</h2>'
            );
          }
        }
      );
    }, 500);
  });
}