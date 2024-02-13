
const register  = require('../js/register');

/*
    This function tests to see if a unique set of name, email, and password
    gives a successful status code of 200.

    @param1 - name
    @param2 - email
    @param3 - password

    @return - 200
*/
test('successful registration returns 200', () => {
    expect(register("Gleezell", "gleezell_uy@dlsu.edu.ph", "P@ssw0rd")).toBe(200);
});


/*
    This function tests to see if a duplicate name, email, and password
    gives a status code that is not 200.

    @param1 - name
    @param2 - email
    @param3 - password

    @return - 200
*/

/*
TODO: uncomment this function once the devs have implemented a register function under '..js/register'

test('duplicate registration does not return 200', () => {
    register("Gleezell", "gleezell_uy@dlsu.edu.ph", "P@ssw0rd");
    expect(register("Gleezell", "gleezell_uy@dlsu.edu.ph", "P@ssw0rd")).not.toBe(200);
});
*/

