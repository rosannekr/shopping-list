var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const db = require("../model/helper");

router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

router.get("/items", (req, res) => {
  //selects the name of products added this week, but we really need everything from items
  db(`SELECT items.id, items.completed,products.name
  FROM items INNER JOIN products 
  ON items.productId=products.id
  WHERE items.weekId=(SELECT id FROM weeks
  WHERE weeks.start=DATE_SUB(CURDATE(),
  INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`)
  .catch(err => res.status(500).send(err))
  .then(results => {
    if (!results.length) {
      res.send("no data")
    } else res.send(results.data);
  })

});
router.post("/newWeek", (req, res)=> {
  db(`INSERT INTO weeks (start)
  SELECT DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY) 
  WHERE NOT EXISTS (SELECT * FROM weeks 
  WHERE start= DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY));

  INSERT INTO items (productId, weekId)
	SELECT products.id, weeks.id 
  FROM products, weeks
  WHERE products.id IN (SELECT productId 
  FROM items GROUP BY productId
  HAVING (SELECT count(productId))/(SELECT COUNT(*) FROM weeks) >= 0.5
  ORDER BY COUNT(productId) DESC)
  AND start=DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY)
  AND products.id NOT IN(
  SELECT products.id
  FROM products INNER JOIN items 
  ON products.id = items.productId
  WHERE items.weekId=(SELECT id FROM weeks
  WHERE weeks.start=DATE_SUB(CURDATE(),
  INTERVAL DAYOFWEEK(CURDATE())-2 DAY)));`)

  .catch(err => res.status(500).send(err))
  .then(results => {
    if (!results.length) {
      res.send("no data")
    } else res.send(results.data);
  })

})
router.post("/startList", (req, res)=> {
  db(`INSERT INTO items (productId, weekId)
	SELECT products.id, weeks.id 
  FROM products, weeks
  WHERE products.id IN (SELECT productId 
  FROM items GROUP BY productId
  HAVING (SELECT count(productId))/(SELECT COUNT(*) FROM weeks) >= 0.5
  ORDER BY COUNT(productId) DESC)
  AND start=DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY)
  AND products.id NOT IN(
  SELECT products.id
  FROM products INNER JOIN items 
  ON products.id = items.productId
  WHERE items.weekId=(SELECT id FROM weeks
  WHERE weeks.start=DATE_SUB(CURDATE(),
  INTERVAL DAYOFWEEK(CURDATE())-2 DAY)));`)

  .catch(err => res.status(500).send(err))
  .then(results => {
    if (!results.length) {
      res.send("no data")
    } else res.send(results.data);
  })

})

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

router.put("/items/", (req, res) => {
  db(`UPDATE items set completed=${req.body.completed}
  WHERE productId=(SELECT products.id FROM products
  WHERE name='${req.body.name}')
  AND weekid=(SELECT weeks.id FROM weeks
  WHERE WEEK(start,1) = WEEK(CURDATE(),1));`)

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

router.delete("/items/", (req, res) => {

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