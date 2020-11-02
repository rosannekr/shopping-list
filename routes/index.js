var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const db = require("../model/helper");

router.use(bodyParser.json());

// Search products
router.get("/products", async (req, res) => {
  try {
    const results = await db(
      `SELECT * FROM products WHERE name LIKE "${req.query.q}%" LIMIT 5`
    );
    res.send(results.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/items", (req, res) => {
  db("SELECT * FROM items;")
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => res.status(500).send(err));
});

router.post("/items", (req, res) => {
  db(`insert into items (text) values ("${req.body.text}");`)
    .catch((err) => res.status(500).send(err))
    .then(() => db("SELECT * FROM items;"))
    .then((results) => {
      res.send(results.data);
    });
});

router.put("/items/", (req, res) => {
  db(
    `update items set complete = ${req.body.complete} where id = ${req.body.id};`
  )
    .catch((err) => res.status(500).send(err))
    .then(() => db("SELECT * FROM items;"))
    .then((results) => {
      res.send(results.data);
    });
});

router.delete("/items/", (req, res) => {
  db(`DELETE FROM items WHERE id = ${req.body.id};`)
    .catch((err) => res.status(500).send(err))
    .then(() => db("SELECT * FROM items;"))
    .then((results) => {
      res.send(results.data);
    });
});

module.exports = router;
