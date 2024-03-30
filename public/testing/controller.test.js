const supertest = require('supertest');
const app = require('../../index.js');

describe("GET /", () => {
    describe("when onboarding loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).get("/").expect(200);
        })
    })

    describe("when starting page does not exist", () => {
        test("return a status code 404", async () => {
            await supertest(app).get("/ho").expect(404);
        })
    })
})

describe("GET /home", () => {
    describe("when home page loads with user id", () => {
        test("return a status code 200", async () => {
            async (req) => {
                await supertest(app).get(`/home/${req.session.user}`).expect(200);
            };
            
        })
    })

    describe("when home page loads without user id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get("/home").expect(404);
        })
    })
})
