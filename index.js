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

// ---------- BEGINNING OF FETCH REQUESTS ---------- //
app.post('/ab', (req, res) => {
  res.sendStatus(200)
})
app.post('/register', (req, res) => {
  res.sendStatus(200)
})
app.post('/login', (req, res) => {
  res.sendStatus(200)
})


// ---------- END OF FETCH REQUESTS ---------------- //

//user bodyParser
app.use(bodyParser.json());

// use router
app.use(routes);

// activate the app instance
app.listen(port, () => {
  console.log(`Server is running at:`);
  console.log(`http://localhost:` + port);
});

module.exports = app;