var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const db = require("../model/helper");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const supersecret = process.env.SUPER_SECRET;

const userMustBeLoggedIn = require("./userMustBeLoggedIn");

router.use(bodyParser.json());

router.get("/profile", userMustBeLoggedIn, (req, res) => {
  console.log(req.decoded);

  res.send({ message: "data" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // check if user exists
  const results = await db(
    `SELECT id FROM users WHERE username = "${username}" AND password = "${password}"`
  );
  if (results.data[0]) {
    // generate token
    const token = jwt.sign({ user_id: results.data[0].id }, supersecret);
    res.send({ message: "Login successful", token });
  } else {
    res.status(401).send("Login not successful");
  }
});

// router.post("/", async (req, res) => {
//   await db(`INSERT INTO users (username, password) VALUES ("test", "test")`);
//   res.send("User registered");
// });

module.exports = router;
