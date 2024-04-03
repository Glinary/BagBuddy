var nameInput = document.getElementById("register-name");
var emailInput = document.getElementById("register-email");
var passwordInput = document.getElementById("register-password");
var confirmPasswordInput = document.getElementById("register-confirm-password");

var nameFeedback = document.getElementById("register-name-feedback");
var emailFeedback = document.getElementById("register-email-feedback");
var passwordFeedback = document.getElementById("register-password-feedback");
var confirmPasswordFeedback = document.getElementById("register-confirm-password-feedback");

// REGEX FROM: https://www.geeksforgeeks.org/javascript-program-to-check-if-a-string-contains-only-alphabetic-characters/
function validateName() {
  let nameLength = nameInput.value.length;
  console.log(nameInput);

  let regexName = /^[a-zA-Z]+$/; // only characters with no spaces are valid

  let isValidName = regexName.test(nameInput.value);
  console.log(isValidName);

  if (!isValidName) {
    nameFeedback.textContent =
      "Please enter a valid name. It must be letters only.";
    nameFeedback.style.color = "var(--main-red)";
    nameFeedback.style.display = "block";
  } else {
    if (nameLength >= 7 && nameLength <= 36) {
      // hide feedback
      nameFeedback.style.display = "none";
    } else {
      nameFeedback.textContent = "Name must be 7 to 36 characters.";
      nameFeedback.style.color = "var(--main-red)";
      nameFeedback.style.display = "block";
    }
  }
}

// REGEX FROM: https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
function validateEmail() {
  let regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

  let isValidEmail = regexEmail.test(emailInput.value);
  console.log(isValidEmail);

  let emailLength;

  if (!isValidEmail) {
    emailFeedback.textContent = "Please enter a valid email.";
    emailFeedback.style.color = "var(--main-red)";
    emailFeedback.style.display = "block";
  } else {
    // hide feedback
    emailFeedback.style.display = "none";
  }
}

function validatePassword() {
  let passwordlength = passwordInput.value.length;

  if (passwordlength < 7) {
    passwordFeedback.textContent =
      "Invalid length of password. Must be at least 7 characters.";
    passwordFeedback.style.color = "var(--main-red)";
    passwordFeedback.style.display = "block";
  } else {
    // hide feedback
    passwordFeedback.style.display = "none";
  }
}

function validateConfirmPassword() {
  if (passwordInput.value === "") {
    confirmPasswordFeedback.textContent = "Please re-enter the password to confirm.";
    confirmPasswordFeedback.style.color = "var(--main-red)";
    confirmPasswordFeedback.style.display = "block";
  } else {
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordFeedback.textContent = "Passwords do not match.";
      confirmPasswordFeedback.style.color = "var(--main-red)";
      confirmPasswordFeedback.style.display = "block";
    } else {
      // hide feedback
      confirmPasswordFeedback.style.display = "none";
    }
  }
}

nameInput.addEventListener("keyup", validateName);
emailInput.addEventListener("keyup", validateEmail);
passwordInput.addEventListener("keyup", validatePassword);
confirmPasswordInput.addEventListener("keyup", validateConfirmPassword);

document.getElementById("register-submit-btn").addEventListener("click", async function (event) {
    event.preventDefault();

    // If the form is invalid, do not submit
    if (!nameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
      console.log("Form is invalid");

      // Call the validation functions to display feedback
      validateName();
      validateEmail();
      validatePassword();
      validateConfirmPassword();
      return;
    }

    const formElement = document.getElementById("registration-form");
    const formData = new FormData(formElement);

    // Convert FormData to JSON for sending to the server
    const data = Object.fromEntries(formData.entries());
    console.log("Form data:", data);

    // Name validation
    const nameResponse = await fetch(`/register/isNameValid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registerName: nameInput.value }),
    });

    const nameData = await nameResponse.json();
    console.log(nameData);

    if (nameData.message === "Name already in use.") {
      nameFeedback.textContent = "Name already in use.";
      nameFeedback.style.color = "var(--main-red)";
      nameFeedback.style.display = "block";
    }

    // Email validation
    const emailResponse = await fetch(`/register/isEmailValid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registerEmail: emailInput.value }),
    });

    const emailData = await emailResponse.json();
    console.log(emailData);

    if (emailData.message === "Email already in use.") {
      emailFeedback.textContent = "Email already in use.";
      emailFeedback.style.color = "var(--main-red)";
      emailFeedback.style.display = "block";
    }

    if (
      nameData.message === "Name is valid." &&
      emailData.message === "Email is valid."
    ) {
      try {
        await register(data);

      } catch (error) {
        console.error("Error registering user:", error);
      }
    } else {
      console.log("Form data is invalid");
    }
});

async function register(data) {
    // Send the form data to the server
    const regResponse = await fetch("/postRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if the response is ok after registration
    if (!regResponse.ok) {
      throw new Error(`Request failed with status ${regResponse.status}`);
    }
  
    // Parse the JSON response
    const responseData = await regResponse.json();
    console.log(responseData);
    // const redLink = responseData.userID;
    window.location.href = `/home`;

    // // Clear email and password fields
    // nameInput.value = "";
    // emailInput.value = "";
    // passwordInput.value = "";
    
}