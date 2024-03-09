// const Users = require('../../schema/Users');

var nameInput       = document.getElementById('register-name');
var emailInput      = document.getElementById('register-email');
var passwordInput   = document.getElementById('register-password');

var nameFeedback    = document.getElementById('register-name-feedback');
var emailFeedback   = document.getElementById('register-email-feedback');
var passwordFeedback= document.getElementById('register-password-feedback');

// REGEX FROM: https://www.geeksforgeeks.org/javascript-program-to-check-if-a-string-contains-only-alphabetic-characters/
function validateName() {
    let nameLength = nameInput.value.length;
    console.log(nameInput);


    let regexName = /^[a-zA-Z]+$/;  // only characters with no spaces are valid
    
    let isValidName = regexName.test(nameInput.value);
    console.log(isValidName);

    if (!isValidName) {
        nameFeedback.textContent = 'Please enter a valid name. It must be characters only.';
        nameFeedback.style.color = 'var(--main-red)';
        nameFeedback.style.display = 'block';
    } else {
        if (nameLength >= 7 && nameLength <= 36) {
            nameFeedback.textContent = 'Valid Name';
            nameFeedback.style.color = 'green';
            nameFeedback.style.display = 'block';
        } else {
            nameFeedback.textContent = 'Name must be 7 to 36 characters.';
            nameFeedback.style.color = 'var(--main-red)';
            nameFeedback.style.display = 'block';
        }
    }
}

// REGEX FROM: https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
function validateEmail() {
    let regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

    let isValidEmail = regexEmail.test(emailInput.value);
    console.log(isValidEmail);

    let emailLength 

    if (!isValidEmail) {
        emailFeedback.textContent = 'Please enter a valid email.';
        emailFeedback.style.color = 'var(--main-red)';
        emailFeedback.style.display = 'block';
    } else {
        emailFeedback.textContent = 'Valid email';
        emailFeedback.style.color = 'green';
        emailFeedback.style.display = 'block';
    }
}

function validatePassword() {
    let passwordlength = passwordInput.value.length;

    if (passwordlength < 7) {
        passwordFeedback.textContent = 'Invalid length pf password. Must be at least 7 characters.';
        passwordFeedback.style.color = 'var(--main-red)';
        passwordFeedback.style.display = 'block';
    } else {
        passwordFeedback.textContent = 'Valid password';
        passwordFeedback.style.color = 'green';
        passwordFeedback.style.display = 'block';
    }
}


nameInput.addEventListener('keyup', validateName);
emailInput.addEventListener('keyup', validateEmail);
passwordInput.addEventListener('keyup', validatePassword);

document.getElementById('registration-form').addEventListener('submit', function(event) {
    if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || passwordInput.value.trim() === '') {
        event.preventDefault();

        if (nameInput.value.trim() === '') {
            nameFeedback.textContent = 'All fields are required.';
            nameFeedback.style.color = 'var(--main-red)';
            nameFeedback.style.display = 'block';
        }

        if (emailInput.value.trim() === '') {
            emailFeedbackFeedback.textContent = 'All fields are required.';
            emailFeedback.style.color = 'var(--main-red)';
            emailFeedback.style.display = 'block';
        }

        if (passwordInput.value.trim() === '') {
            passwordFeedback.textContent = 'All fields are required.';
            passwordFeedback.style.color = 'var(--main-red)';
            passwordFeedback.style.display = 'block';
        }
    }
});


function register(name, email, password) {
    let resultName = validateName();
    let resultEmail = validateEmail();
    let resultPassword = validatePassword();


}

module.exports  = { register };