// import express from "express";
// import bodyParser from "body-parser";
// import exphbs from "express-handlebars";
// import routes from "./routes/routes.js";
// import "dotenv/config";

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const routes = require('./routes/routes.js');
require('dotenv').config()

const port = process.env.PORT || 3000;

const app = express();
// Set public folder to 'public'
app.use("/static", express.static("public"));

app.engine("hbs", exphbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs"); // set express' default templating engine
app.set("views", "./views");

//user bodyParser
app.use(bodyParser.json());

// use router
app.use(routes);

// activate the app instance
app.listen(port, () => {
  console.log(`Server is running at:`);
  console.log(`http://localhost:` + port);
});
