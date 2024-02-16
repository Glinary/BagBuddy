<<<<<<< Updated upstream
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
=======
const express = require("express");
const routes = require("./routes/routes.js");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const { connect_to_mongodb } = require("./public/js/main.js");



>>>>>>> Stashed changes

const port = process.env.PORT || 3000;

const app = express();
// Connect to MongoDB
async function connect() {
  const status = await connect_to_mongodb();
  if (status === 200) {
    //Connect Schemas
    const Items = require(path.join(__dirname, "./schema/Items"));
    const Users = require(path.join(__dirname, "./schema/Users"));
    const Bags = require(path.join(__dirname, "./schema/Bags"));
  } else {
    console.log("Connection failed.");
  }
}
connect();

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
