import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json())

const controller = {

    getStart: async function (req, res) {
        res.render("index", {
            title: "index",
            css1: "public/css/main.css",
            js1: "public/js/main.js"
        });
    },

    postStart: async function (req, res) {
        let {userInput} = req.body;

        if (userInput) {
            try {
                console.log(userInput);

            } catch (e) {
                console.log("error", e);
            }
        }

        res.json(userInput);
    }
    
};

export default controller;