const request = require('supertest');
const app = require('../../index.js');
const { login }  = require('../js/login');
const Users = require('../../schema/Users');

/*
    This function tests to see if a registered set of email, and password
    gives a successful status code of 200.

    @param1 - email
    @param2 - password

*/
test('successful login returns a 200', () => {
    expect(login("gleezell_uy@dlsu.edu.ph", "P@ssw0rd")).toBe(200);
});
describe("POST /login", () => {
    describe("given a valid email and password", () => {
        test("return a status code 200", async () => {
            const res = await request(app).post("/login").send({
                email: "gleezell_uy@dlsu.edu.ph",
                password: "P@ssw0rd",
            })
            expect(res.statusCode).toBe(200);
        })
    })

    describe("given an email and password that does not exist", () => {
        test("return a status code that is not 200", async () => {
            const res = await requeest(app).post("/login").send({
                email: "i do not exist",
                password: "i do not exist",
            })
            expect(res.statusCode).not.toBe(200);
        })
    })
})
/*
    This function tests to see if an unregistered set of email, and password
    gives a status code that is not 200.

    @param1 - email
    @param2 - password

*/

test('unsuccessful login does not return 200', () => {
    expect(login("first_last@dlsu.edu.ph", "P@ssw0rd")).not.toBe(200);
});

/****************************************************************************************/
jest.mock('../../schema/Users', () => ({
    findOne: jest.fn(),
}));

describe('Login Function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('returns 200 for successful login', async() => {
        const mockUser = {compare: jest.fn(() => true)};
        Users.findOne.mockResolvedValue(mockUser);

        const statusCode = await login('gleezell_uy@dlsu.edu.ph', 'P@ssw0rd');
        expect(statusCode).toBe(200);

        expect(Users.findOne).toHaveBeenCalledWith({email: 'gleezell_uy@dlsu.edu.ph' });
        expect(mockUser.compare).toHaveBeenCalledWith('P@ssw0rd');
        });

    test('returns 402 given that password is incorrect', async() => {
        const mockUser = {compare: jest.fn(() => false)};
        Users.findOne.mockResolvedValue(mockUser);

        const statusCode =await login('gleezell_uy@dlsu.edu.ph','wrongP@ssw0rd');
        expect(statusCode).toBe(402);

        expect(Users.findOne).toHaveBeenCalledWith({ email:'gleezell_uy@dlsu.edu.ph' });
        expect(mockUser.compare).toHaveBeenCalledWith('wrongP@ssw0rd');
    });
    test('returns 403 given that email does not exist', async() => {
        Users.findOne.mockResolvedValue(null);

        const statusCode = await login('hello@dlsu.edu.ph', 'MyP@ssw0rd');
        expect(statusCode).toBe(403);
        
        expect(Users.findOne).toHaveBeenCalledWith({ email:'hello@dlsu.edu.ph' });
    });
});