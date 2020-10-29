var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const db = require("../model/helper");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const supersecret = process.env.SUPER_SECRET;

const bcrypt = require("bcrypt");
const saltRounds = 10;

const userMustBeLoggedIn = require("../guards/userMustBeLoggedIn");

router.use(bodyParser.json());

// Get list of users
router.get("/", async (req, res) => {
  try {
    const results = await db(`SELECT * FROM users;`);
    res.send(results.data);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // hash password
    const hash = await bcrypt.hash(password, saltRounds);

    // store username and hash in database
    await db(
      `INSERT INTO users (username, password) VALUES ("${username}", "${hash}")`
    );
    res.send({ message: "Register successful" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// LOG IN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // check if there is a user with provided username
    const results = await db(
      `SELECT * FROM users WHERE username = "${username}"`
    );
    const user = results.data[0];

    if (user) {
      // verify password (by comparing the typed in password with hash stored in db)
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // generate token with user id as payload and secret key
        const token = jwt.sign({ user_id: user.id }, supersecret);
        // send token to the user
        res.send({ message: "Login successful", token });
      } else {
        throw new Error("Incorrect password");
      }
    } else {
      // throw error if user is not in the database
      throw new Error("Invalid username");
    }
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
});

// Access private data
router.get("/profile", userMustBeLoggedIn, async (req, res) => {
  try {
    // get user data
    const results = await db(
      `SELECT username FROM users WHERE id = ${req.decoded.user_id}`
    );
    res.send({ message: "Your data", data: results.data[0] });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
});

module.exports = router;
