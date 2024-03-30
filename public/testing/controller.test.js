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

describe("GET /bag", () => {
    //TODO: find the right syntax to load the right user id and bag id
    describe("when bag loads with user id and bag id", () => {
        test("return a status code 200", async () => {
            async (req) => {
                await supertest(app).get(`/bag/${req.params.user}/${req.params.id}`).expect(200);
            };
            
        })
    })

    describe("when bag loads without user id and bag id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get("/bag").expect(404);
        })
    })
})

//TODO: add test for GET /notification
// describe("GET /notification", () => {
//     describe("when notification loads properly", () => {
//         test("return a status code 200", async () => {
//             await supertest(app).get(`/notification`).expect(200);
//         })
//     })
// })

describe("GET /addbag", () => {
    describe("when bag can be added to existing user id", () => {
        const userId = '65c214c5e060af77ba686b39';
        test("return a status code 200", async () => {
            await supertest(app).get(`/addbag/${userId}`).expect(200);
        })
    })

    describe("when bag is added without user id", () => {
        const userId = '111';
        test("return a status code 200", async () => {
            await supertest(app).get(`/addbag`).expect(404);
        })
    })
})


