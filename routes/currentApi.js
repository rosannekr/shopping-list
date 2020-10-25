var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const db = require("../model/helper");

router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

router.get("/items", (req, res) => {
  //select items from current week
  db(`SELECT items.id, items.completed,products.name
    FROM items INNER JOIN products 
    ON items.productId=products.id
    WHERE items.weekId=(SELECT id FROM weeks
    WHERE weeks.start=DATE_SUB(CURDATE(),
    INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`)
    .then(results => {
      res.send(results.data);
    })
    .catch(err => res.status(500).send(err));
});

router.post("/items", (req, res) => {
  db(`INSERT INTO products (name)
  SELECT '${req.body.name}'
  WHERE NOT EXISTS (SELECT * FROM products
  WHERE name='${req.body.name}');

  INSERT INTO items (weekid, productid)
  SELECT weeks.id, products.id FROM weeks, products
  WHERE start=DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY)
  AND name='${req.body.name}';`)
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
