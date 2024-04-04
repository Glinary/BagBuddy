// const path = require("path");
// const Users = require(path.join(__dirname, "../../schema/Users"));

// Button

const logBtn = document.querySelector("#login-submit-btn");
var emailInput = document.getElementById("email");

function validateEmail() {
  let regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

  let isValidEmail = regexEmail.test(emailInput.value);
  console.log(isValidEmail);


  if (!isValidEmail) {
    document.getElementById("error-message").innerText = "Please put a valid email";
    document.getElementById("error-message").style.display = "block";
  } else {
    // hide error
    document.getElementById("error-message").style.display = "none"; // Hide error message
  }
  return isValidEmail;
}

emailInput.addEventListener("keyup", validateEmail);

logBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  console.log("-----LOGIN CLICK-----");

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  if (email == "" || password == "") {
    // Display Error Message
    document.getElementById("error-message").innerText = "Please fill in the boxes";
  } else if (!validateEmail()) {
    console.log("Form is invalid");
    validateEmail();
    return;
  }  else {

    const data = { email, password };

    // Convert the data object to JSON

    const json = JSON.stringify(data);

    console.log(json);

    login(json);

  }
});

async function login(jsonData) {
  console.log(jsonData);

  try {
    const response = await fetch("/postlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    });

    if (response.ok) {
      console.log("-----LOGIN SUCCESS-----");

      // resData = await response.json();
      // resLink = resData.uID;
      //   Redirect to home page upon successful login
      window.location.href = `/home`;
    } else {
      // Unsuccessful login
      console.error("Login failed: ", response.statusText);

      const errorMessage = await response.text();

      // Display Error Message
      document.getElementById("error-message").innerText = errorMessage;
      document.getElementById("error-message").style.display = "block";

      // Clear email and password fields
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    }
  } catch (err) {
    console.error("Login failed:", err);
  }
}

// module.exports = { login };
