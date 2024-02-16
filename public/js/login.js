// const path = require("path");
// const Users = require(path.join(__dirname, "../schema/Users"));

function login(email, password) { // put async
    // try {
    //     const logUser = await Users.findOne({email: email});
    //     if (logUser != null) {
    //         const passStatus = await mainUser.compare(password);
    //         if (passStatus) {
    //             return 200;
    //         } else {
    //             console.log("Incorrect Password");
    //             return 402;
    //         }
    //     } else {
    //         console.log("Email does not exist");
    //         return 403;
    //     }
    // } catch (err) {
    //     console.error(err);
    // }
    
    if(email === "gleezell_uy@dlsu.edu.ph" && password === "P@ssw0rd") {
        return 200;
    } else {
        return 402;
    }
}

module.exports = { login };