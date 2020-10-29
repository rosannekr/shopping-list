const jwt = require("jsonwebtoken");
require("dotenv").config();
const supersecret = process.env.SUPER_SECRET;

// Use throw new error here?

// authorization
function userMustBeLoggedIn(req, res, next) {
  // grab token from header in request
  const token = req.headers["x-access-token"];

  if (!token) {
    res.status(401).send({ message: "Provide a token" });
  } else {
    // check if token is valid
    jwt.verify(token, supersecret, function (err, decoded) {
      if (err) {
        res.status(401).send(err.message);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
}

module.exports = userMustBeLoggedIn;
