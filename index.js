const express = require("express");
const routes = require("./routes/routes.js");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

// Session
const session = require('express-session');
const MongoStore = require('connect-mongo');


const { connect_to_mongodb } = require("./public/js/main.js");

dotenv.config();
const urlDB = process.env.MONGODB_URL;
const port = process.env.PORT || 3000;

const app = express();

// Connect to MongoDB
async function connect() {
  const status = await connect_to_mongodb();
  if (status === 200) {
    console.log("Connection Success");
  } else {
    console.log("Connection failed.");
  }
}
connect();

//Connect Schemas
const Items = require(path.join(__dirname, "./schema/Items"));
const Users = require(path.join(__dirname, "./schema/Users"));
const Bags = require(path.join(__dirname, "./schema/Bags"));

async function addUsers() {
  const user1 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "endicoco@gmail.com",
    name: "Peter Hopkins",
    password: "test123"
  });
}
// addUsers(); //uncomment to add test users

// Set public folder to 'public'
app.use("/static", express.static("public"));

app.engine("hbs", exphbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs"); // set express' default templating engine
app.set("views", "./views");

//user bodyParser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// initialize session
app.use(session({
  secret: 'KwekKwek', // this should be in dotenv, will generate secret later on
  resave: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 1}, // change the last operator depending on the number of days the session will last
  saveUninitialized: true, // set to true so it will generate sesh id upon opening website
  store: MongoStore.create({ mongoUrl: urlDB })
}));

// use router
app.use(routes);

// activate the app instance
app.listen(port, () => {
  console.log(`Server is running at:`);
  console.log(`http://localhost:` + port);
});

module.exports = app;


