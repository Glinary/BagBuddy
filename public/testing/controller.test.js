const supertest = require('supertest');
const app = require('../../index.js');

/********** START OF GET REQUESTS **********/
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
    //TODO: make test work with the needed id (currently undefined)
    // describe("when home page loads with user id", () => {
    //     test("return a status code 200", async () => {
    //         await supertest(app).get(`/home/${req.session.user}`).expect(200);  
    //     })
    // })

    describe("when home page loads without user id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get("/home").expect(404);
        })
    })
})

describe("GET /home", () => {
        //TODO: make test work with the needed id (currently undefined)
//     describe("when home page loads with user id", () => {
//         test("return a status code 200", async () => {
//             await supertest(app).get(`/home/${req.session.user}`).expect(200);
            
//         })
//     })

    describe("when home page loads without user id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get("/home").expect(404);
        })
    })
})

describe("GET /bag", () => {
    //TODO: find the right syntax to load the right user id and bag id
    // describe("when bag loads with user id and bag id", () => {
    //     test("return a status code 200", async () => {
    //         await supertest(app).get(`/bag/${req.params.user}/${req.params.id}`).expect(200);
            
    //     })
    // })

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
        test("return a status code 404", async () => {
            await supertest(app).get(`/addbag`).expect(404);
        })
    })

    //TODO: add test for GET /addbag page loads with a nonexistent user id
    // describe("when addbag page loads with a nonexistent user id", () => {
    //     const userId = '88888';
    //     test("return a status code 200", async () => {
    //         await supertest(app).get(`/addbag/${userId}`).expect(404);
    //     })
    // })
})

describe("GET /editbag", () => {
    describe("when editbag page loads to existing user id", () => {
        const userId = '6607c1d30a1effb0643f2f34';
        const bagId = '6607c2400a1effb0643f2f3b';
        test("return a status code 200", async () => {
            await supertest(app).get(`/editbag/${userId}/${bagId}`).expect(200);
        })
    })

    describe("when bag is added without user id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get(`/editbag`).expect(404);
        })
    })

    //TODO: add test for GET /editbag loads with nonexistent id credentials
    // describe("when bag is added without user id", () => {
    //     const userId = '8888';
    //     const bagId = '8888';
    //     test("return a status code 200", async () => {
    //         await supertest(app).get(`/addbag/${userId}/${bagId}`).expect(404);
    //     })
    // })
})

describe("GET /additem", () => {
    //TODO: make test work with the needed id (currently undefined)
    // describe("when additem page loads to existing user id", () => {
    //     const userId = '6607c1d30a1effb0643f2f34';
    //     test("return a status code 200", async () => {
    //         await supertest(app).get(`/additem/${userId}`).expect(200);
            
    //     })
    // })

    describe("when additem page loads without user id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get(`/additem`).expect(404);
        })
    })

    //TODO: add test for GET /additem loads with nonexistent id credentials
    // describe("when item is added with nonexisting user id", () => {
    //     const userId = '8888';
    //     test("return a status code 404", async () => {
    //         await supertest(app).get(`/additem/${userId}`).expect(404);
            
    //     })
    // })
})

describe("GET /itemgallery", () => {
    describe("when itemgallery page loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).get(`/itemgallery`).expect(200);
        })
    })
})

describe("GET /login", () => {
    describe("when login page loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).get(`/login`).expect(200);
        })
    })
})

describe("GET /register", () => {
    describe("when register page loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).get(`/register`).expect(200);
        })
    })
})


//TODO: make test for GET /profile
// describe("GET /profile", () => {
//     describe("when profile page loads properly", () => {
//         test("return a status code 200", async () => {
//             await supertest(app).get(`/profile`).expect(200);
            
//         })
//     })
// })

/********** END OF GET REQUESTS **********/
/********** START OF POST REQUESTS **********/
/********** END OF POST REQUESTS **********/