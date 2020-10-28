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
  db(`SELECT items.id, items.completed,products.name FROM items 
    INNER JOIN products ON items.productId=products.id

    WHERE items.weekId=(SELECT id FROM weeks
    WHERE weeks.start=DATE_SUB(CURDATE(),
    INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`)
    .then(results => {
      res.send(results.data);
    })
    .catch(err => res.status(500).send(err));
});

router.post("/items", (req, res) => {
  //add item name to products if not there
  //and add item instance to this week's items 
  //return list for the week
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

router.post("/items/auto", async (req, res) => {
  //add current week if does not exist
  try {
   await db(`INSERT INTO weeks (start)
  SELECT DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY) 
  WHERE NOT EXISTS (SELECT * FROM weeks 
  WHERE start= DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY));
  `)
  //insert common items as this week if not already in this week 
  await db(`INSERT INTO items (productId, weekId)
	SELECT products.id, weeks.id 
  FROM products, weeks

  WHERE products.id IN (SELECT productId 
  FROM items GROUP BY productId
  HAVING (SELECT count(productId)) > 4
  ORDER BY COUNT(productId) DESC)
  AND start=DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY)

  AND products.id NOT IN(
  SELECT products.id
  FROM products INNER JOIN items 
  ON products.id = items.productId
  WHERE items.weekId=(SELECT id FROM weeks
  WHERE weeks.start=DATE_SUB(CURDATE(),
  INTERVAL DAYOFWEEK(CURDATE())-2 DAY)));`)

  //return this week's items
  const results = await db(`SELECT items.id, items.completed,products.name
      FROM items INNER JOIN products 
      ON items.productId=products.id
      WHERE items.weekId=(SELECT id FROM weeks
      WHERE weeks.start=DATE_SUB(CURDATE(),
      INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`)

      res.send(results.data);

} catch (err) {
  console.log(err)
  res.status(500).send(err);
}
});

router.post("/items/auto/push", async (req, res) => {
  //create next week if not exists, add item to next week
  await db(`INSERT INTO weeks (start) SELECT DATE_ADD(
    DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY),INTERVAL 1 week)
    WHERE NOT EXISTS (SELECT * FROM weeks WHERE start= 
    DATE_ADD(DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY),INTERVAL 1 week));

    INSERT INTO items (weekid, productid)
    SELECT weeks.id, products.id FROM weeks, products
    WHERE start=DATE_ADD(DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY),INTERVAL 1 week)
    AND name='${req.body.name}';`)
    
  //return this week 
  const results = await db(`SELECT items.id, items.completed,products.name
      FROM items INNER JOIN products 
      ON items.productId=products.id
      WHERE items.weekId=(SELECT id FROM weeks
      WHERE weeks.start=DATE_SUB(CURDATE(),
      INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`)

  res.send(results.data);
});

router.put("/items", (req, res) => {
  //set completed for selected item to current date and return this week
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
  //delete selected item from current week 
  db(`DELETE FROM items WHERE id = ${req.body.id};`)

    .catch(err => res.status(500).send(err))

    .then(() => db(`SELECT items.id, items.completed,products.name
    FROM items INNER JOIN products 
    ON items.productId=products.id
    WHERE items.weekId=(SELECT id FROM weeks
    WHERE weeks.start=DATE_SUB(CURDATE(),
    INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`)
    .then(results => {
      res.send(results.data);
    }));

});


module.exports = router;
