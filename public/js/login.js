// const path = require("path");
// const Users = require(path.join(__dirname, "../../schema/Users"));



// Button

const logBtn = document.querySelector("#login-submit-btn");


logBtn.addEventListener("click", async function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const data = { email, password };

    // Convert the data object to JSON

    const json = JSON.stringify(data);

    console.log(json);

    login(json);
});


async function login(jsonData) {

    console.log(jsonData);

    try {

        const response = await fetch('/postlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });

        if (response.ok) {
            // Redirect to home page upon successful login
            window.location.href = '/home';
        } else {
            // Unsuccessful login
            console.error("Login failed: ", response.statusText);

            const errorMessage = await response.text();

            // Display Error Message
            document.getElementById('error-message').innerText = errorMessage;

            // Clear email and password fields
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';

        }

    } catch (err) {
        console.error("Login failed:", err);
    }
}

// module.exports = { login };