var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const db = require("../model/helper");

router.use(bodyParser.json());

router.get("/weeks", (req, res) => {
  //show all weeks
  db(`SELECT * FROM weeks;`)
  .catch(err => res.status(500).send(err))
  .then(results => {
    res.send(results.data);
  });
});

router.get("/weeks/:id", (req, res) => {
  //show items for specific week
  db(`SELECT items.id, items.completed,products.name
  FROM items INNER JOIN products 
  ON items.productId=products.id
  WHERE items.weekId=${req.params.id};`)

  .catch(err => res.status(500).send(err))
  .then(results => {
    res.send(results.data);
  });
});

router.post("/", (req, res) => {
  db(`SELECT items.id, items.completed,products.name
      FROM items INNER JOIN products 
      ON items.productId=products.id
      WHERE items.weekId=(SELECT id FROM weeks
      WHERE weeks.start=DATE_SUB(CURDATE(),
      INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`)
  .catch(err => res.status(500).send(err))
  .then(results => {
      res.send(results.data);
    });
  })

router.put("/items", (req, res) => {
  db(`  UPDATE items set completed=${req.body.completed}
  WHERE productId=(SELECT products.id FROM products
  WHERE name='${req.body.name}')
  AND weekid=(SELECT id FROM weeks
  WHERE weeks.start=DATE_SUB(CURDATE(),
  INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`)

  .catch(err => res.status(500).send(err))

  .then(() => db(`SELECT items.id, items.completed,products.name
    FROM items INNER JOIN products 
    ON items.productId=products.id
    WHERE items.weekId=(SELECT id FROM weeks
    WHERE weeks.start=DATE_SUB(CURDATE(),
    INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`))
    .then(results => {
      res.send(results.data);
    })
    .catch(err => res.status(500).send(err));
});

router.delete("/items", (req, res) => {
  db(`DELETE FROM items WHERE id = ${req.body.id};`)

    .catch(err => res.status(500).send(err))

    .then(() => db(`SELECT items.id, items.completed,products.name
    FROM items INNER JOIN products 
    ON items.productId=products.id
    WHERE items.weekId=(SELECT id FROM weeks
    WHERE weeks.start=DATE_SUB(CURDATE(),
    INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`))
    .then(results => {
      res.send(results.data);
    });
});

module.exports = router;