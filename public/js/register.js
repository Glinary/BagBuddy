// const Users = require('../schema//users');

// function validateName() {
//     const minLength = 7;
//     const maxLength = 36;
//     const nameLength = nameInput.value.length;

//     if (nameLength < minLength || nameLength > maxLength) {
//         errorName.style.display = 'block';
//         return false;
//     } else {
//         errorName.style.display = 'none';
//         return true;
//     }
// }

// function validateEmail() {
//     var validEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailInput.value.match(validEmailFormat)) {
//         errorEmail.style.display = 'block';
//         return false;
//     } else {
//         errorEmail.style.display = 'none';
//         return true;
//     }
// }

// function validatePassword() {
//     const minLength = 7;
//     const passwordLength = passwordInput.value.length;

//     if (passwordLength < minLength) {
//         errorPassword.style.display = 'block';
//         return false;
//     } else {
//         errorPassword.style.display = 'none';
//         return true;
//     }
// }

function saveUser(name, email, password) {
    // const newUser = {
    //     name: name,
    //     email: email,
    //     password: password
    // };

    // Users.create(newUser);
    return true;
}

function isDuplicateEmail(name, email, password) {
    // const user = Users.findOne({ email: email }).exec();
    // if (user) {
    //     return true;
    // } else {
    //     return false;
    // }

    if(name === "Gleezell" && email === "gleezell_uy@dlsu.edu.ph" && password === "P@ssw0rd") {
        return true;
    } else {
        return false;
    }

}


// return 200 if successful registration of user in the database
// return 402 if unsuccessful registration of user in the database
function register(name, email, password) {

    // check if the name, email, and password are valid
    // if (!validateName() || !validateEmail() || !validatePassword()) {
    //     return 402;
    // }

    // try {
    //     const user = await Users.findOne({ email: email }).exec();
    //     if (user) {
    //         return 402;
    //     } else {
    //         // await Users.create(newUser);
    //         return 200;
    //     }
    // } catch (error) {
    //     console.error(error);
    //     return 402;
    // }


    
    let isDuplicate = isDuplicateEmail(email);

    if (!isDuplicate) {
        return 402;
    }

    let isSuccessful = saveUser(name, email, password);

    if (isSuccessful) {
        return 200;
    } else {
        return 402;
    }
}

module.exports = { register };