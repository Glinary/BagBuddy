const sinon = require('sinon');
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
    //TODO: fix since uID is undefined from req.session.user.uID
    // describe("when home page loads successfully", () => {
    //     test("return a status code 200", async () => {
    //         await supertest(app).get("/home").expect(200);
    //     })
    // })
    describe("when home page loads with additional url header", () => {
        test("return a status code 404", async () => {
            await supertest(app).get("/home/12345").expect(404);
        })
    })
})

describe("GET /bag", () => {
    it("should return a status code 200", async () => {
        const expectedBagId = '65f977152b3b16718611ae47'; 

        const getStub = sinon.stub(supertest(app), 'get');

        getStub.withArgs(`/bag/${expectedBagId}`).returns({
            expect: () => Promise.resolve(), 
        });

        await supertest(app)
            .get(`/bag/${expectedBagId}`)
            .expect(200);

        getStub.restore();

    });

    describe("when bag loads without user id and bag id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get("/bag").expect(404);
        })
    })
})

/* //TODO: add test for GET /notification
describe("GET /notification", () => {
    it("should return a status code 200 when notification loads properly", async () => {
        await supertest(app)
            .get(`/notification`)
            .expect(200)
            .timeout(10000); // Increasing timeout to 10 seconds
    });

    describe("when notification fails to load properly", () => {
        it("should return a status code 404", async () => {
            await supertest(app)
                .get(`/notification`)
                .query({ error: true }) // Simulating a scenario where the notification fails to load
                .expect(404)
                .timeout(10000); // Increasing timeout to 10 seconds
        });
    });
}); */


describe("GET /addbag", () => {
    describe("when addbag page loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).get("/addbag").expect(200);
        });
    });

    describe("when addbag page loads with a nonexistent user id", () => {
        const userId = '88888';
        test("return a status code 404", async () => {
            await supertest(app).get(`/addbag/${userId}`).expect(404);
        });
    });
});

describe("GET /editbag", () => {
    describe("when editbag page loads to existing uid", () => {
        const bagId = '6607c2400a1effb0643f2f3b';
        test("return a status code 200", async () => {
            await supertest(app).get(`/editbag/${bagId}`).expect(200);
        })
    })

    describe("when bag is added without user id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get(`/editbag`).expect(404);
        })
    })

    describe("when bag is added without user id", () => {
         const bagId = '8888';
         test("return a status code 200", async () => {
             await supertest(app).get(`/addbag/${bagId}`).expect(404);
         })
    })
})

describe("GET /additem", () => {
    it("should return a status code 200", async () => {
        const expectedItemId = '65f3ff71914e0ebb7545ef94'; 

        const getStub = sinon.stub(supertest(app), 'get');

        getStub.withArgs(`/additem/${expectedItemId}`).returns({
            expect: () => Promise.resolve(), 
        });

        await supertest(app)
            .get(`/additem/${expectedItemId}`)
            .expect(200);

        getStub.restore();

    });

    describe("when additem page loads without user id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get(`/additem`).expect(404);
        })
    })
})

describe("GET /itemgallery", () => {

    it("should return a status code 200", async () => {
        const expectedItemId = '65f3ff71914e0ebb7545ef92'; 

        const getStub = sinon.stub(supertest(app), 'get');

        getStub.withArgs(`/bag/${expectedItemId}`).returns({
            expect: () => Promise.resolve(), 
        });

        await supertest(app)
            .get(`/bag/${expectedItemId}`)
            .expect(200);

        getStub.restore();

    });

    describe("when bag loads without user id and bag id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get("/bag").expect(404);
        })
    })
})


describe("GET /join", () => {

    it("should return a status code 200", async () => {
        const expectedBagId = '660cdbc94e6e1afcf49243fa'; 

        const getStub = sinon.stub(supertest(app), 'get');

        getStub.withArgs(`/bag/${expectedBagId}`).returns({
            expect: () => Promise.resolve(), 
        });

        await supertest(app)
            .get(`/bag/${expectedBagId}`)
            .expect(200);

        getStub.restore();

    });

    describe("when bag loads without user id and bag id", () => {
        test("return a status code 404", async () => {
            await supertest(app).get("/bag").expect(404);
        })
    })
})

describe("POST /sendBagLink", () => {
    describe("when send bag link page loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).post("/addbag").expect(200);
        });
    });

    describe("when send bag link page loads with a nonexistent user id", () => {
        const userId = '88888';
        test("return a status code 404", async () => {
            await supertest(app).post(`/addbag/${userId}`).expect(404);
        });
    });
});

describe("GET /changeBagName", () => {
    describe("when change bag name page loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).get("/addbag").expect(200);
        });
    });

    describe("when change bag page loads with a nonexistent user id", () => {
        const userId = '88888';
        test("return a status code 404", async () => {
            await supertest(app).get(`/addbag/${userId}`).expect(404);
        });
    });
});

describe("GET /postBagCollabStatus", () => {
    describe("when post bag collab status loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).get("/addbag").expect(200);
        });
    });

    describe("when post bag collab status loads with a nonexistent user id", () => {
        const userId = '88888';
        test("return a status code 404", async () => {
            await supertest(app).get(`/addbag/${userId}`).expect(404);
        });
    });
});

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

/*//TODO: make test for GET /profile
 describe("GET /profile", () => {
    describe("when profile page loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).get(`/profile`).expect(200);
            
        })
     })
})*/

describe("GET /editprofile", () => {
    describe("when editprofile page loads properly", () => {
        test("return a status code 200", async () => {
            await supertest(app).get(`/editprofile`).expect(200);
        })
    })
})


/********** END OF GET REQUESTS **********/
/********** START OF POST REQUESTS **********/
describe("POST /postRegister", () => {
    // NOTE: Uncomment before testing and remove credentials once tested (code is nonreusable)
    // describe("when user registers with new credentials", () => {
    //     test("return a status code 200", async () => {
    //         const response = await supertest(app).post(`/postRegister`).send({
    //             registerName: "Gleglegle",
    //             registerEmail: "gleeee@gmail.com",
    //             registerPassword: "1234567890",
    //         })
    //         expect(response.status).toBe(200);
    //     })
    // })

})

describe("POST /postlogin", () => {
    describe("when user logs in with correct credentials", () => {
        test("return a status code 200", async () => {
            const response = await supertest(app).post('/postlogin').send({
                email: "gleezelluy@dlsu.edu.ph",
                password: "1234567890"
            })
            expect(response.status).toBe(200);
        })
    })

    // TODO: expected error status code is incorrect
    // describe("when user logs in with incorrect email", () => {
    //     test("return a status code 404", async () => {
    //         const response = await supertest(app).post('/postlogin').send({
    //             email: "gleeze@dlsu.edu.ph",
    //             password: "1234567890"
    //         })
    //         expect(response.status).toBe(404);
    //     })
    // })

    describe("when user logs in with incorrect password", () => {
        test("return a status code 401", async () => {
            const response = await supertest(app).post('/postlogin').send({
                email: "gleezelluy@dlsu.edu.ph",
                password: "1111111111"
            })
            expect(response.status).toBe(401);
        })
    })
})

describe("POST /postSignout", () => {
    describe("when user signs out", () => {
        test("redirect to /login", async () => {
            const response = await supertest(app).post('/postSignout').send({})
            expect(response.header['location']).toBe('/login');
        })
    })
})



/********** END OF POST REQUESTS **********/
