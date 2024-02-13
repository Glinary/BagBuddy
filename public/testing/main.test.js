/*
Code references
1. https://stackoverflow.com/questions/76256585/how-to-store-an-express-session-in-a-mongodb-database-using-a-controller
2. https://jestjs.io/docs/api#describename-fn
*/

/*
SAMPLE TEST
const { connect } = require('../js/main');

test('if return 0, test passes', () => {
    expect(connect(0)).toBe(0);
});

*/

const { generate_session_id } = require('../js/main');

/*
    TODO: "connect_to_mongodb()"
*/

/*
    This function tests if a session id was successfully generated before
    user attempts to login or register.
*/
test('successfully generates a session id to be stored on mongodb and returns 200', () => {
    expect(generate_session_id()).toBe(200);
});

/*
    This function ensures that failing to generate a session id due to 
    an unsuccessful connection to MongoDB does not return 200. 
*/

/*
TODO: uncomment this once connect_to_mongodb() has been implemented.

test('failed connection to MongoDB does not return 200', () => {
    // Mock the connect_to_mongodb function to return 500
    jest.mock('../js/main', () => ({
        ...jest.requireActual('../js/main'),
        connect_to_mongodb: jest.fn(() => 500)
    }));

    // Call the function
    let result = connect_to_mongodb();

    // Assert that the result is not 200
    expect(result).not.toBe(200);
});
*/
