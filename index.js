const express = require("express");
const routes = require("./routes/routes.js");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const { connect_to_mongodb } = require("./public/js/main.js");


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
app.use(bodyParser.json());

// use router
app.use(routes);

// activate the app instance
app.listen(port, () => {
  console.log(`Server is running at:`);
  console.log(`http://localhost:` + port);
});
