const jwt = require("jsonwebtoken");
require("dotenv").config();
const supersecret = process.env.SUPER_SECRET;

function userMustBeLoggedIn(req, res, next) {
  // grab token from header in request
  const token = req.headers["x-access-token"];

  if (!token) {
    res.status(401).send({ message: "Provide a token" });
  } else {
    // verify token
    jwt.verify(token, supersecret, function (err, decoded) {
      if (err) res.status(401).send(err);
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
}

module.export = userMustBeLoggedIn;
