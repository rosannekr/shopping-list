var express = require("express");
var router = express.Router();
const db = require("../model/helper");

router.get("/", function(req, res, next) {
  db("SELECT * FROM weeks;")
    .then(results => {
      res.send(results.data);
    })
    .catch(err => res.status(500).send(err));
});

router.get("/:id", function(req, res, next) {
  //your code here
});

router.post("/", function(req, res, next) {
  //your code here
});

router.delete("/:id", function(req, res, next) {
  //your code here
});

module.exports = router;