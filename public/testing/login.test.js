const { login }  = require('../js/login');

/*
    This function tests to see if a registered set of email, and password
    gives a successful status code of 200.

    @param1 - email
    @param2 - password

*/
test('successful login returns a 200', () => {
    expect(login("gleezell_uy@dlsu.edu.ph", "P@ssw0rd")).toBe(200);
});

/*
    This function tests to see if an unregistered set of email, and password
    gives a status code that is not 200.

    @param1 - email
    @param2 - password

*/

test('unsuccessful login does not return 200', () => {
    expect(login("first_last@dlsu.edu.ph", "P@ssw0rd")).not.toBe(200);
});