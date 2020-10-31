var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const db = require("../model/helper");

const userMustBeLoggedIn = require("../guards/userMustBeLoggedIn");

router.use(bodyParser.json());

/* Get suggestions for this week's shopping list */
router.get("/items", userMustBeLoggedIn, async (req, res) => {
  let sql = `SELECT products.name, products.id FROM items INNER JOIN products ON items.productId = products.id WHERE items.userId = ${req.decoded.user_id}`;

  // Change query based on query parameter
  if (req.query.filter === "frequent" || !req.query.filter) {
    // Get most frequently bought items: count how many times products occur in items table
    sql += ` GROUP BY items.productId ORDER BY COUNT(items.id) DESC LIMIT 40;`;
  } else if (req.query.filter === "recent") {
    // Get most recently bought items: set weekId to be last week
    sql += ` AND weekId = (SELECT weeks.id FROM weeks WHERE start = DATE_SUB(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 1 WEEK));`;
  }

  try {
    const results = await db(sql);
    res.send(results.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

/* Add new item to this week's shopping list */
router.post("/items", userMustBeLoggedIn, async (req, res) => {
  try {
    // Check if current week is in database
    const resultsWeek = await db(
      `SELECT id FROM weeks WHERE start = CURDATE() - WEEKDAY(CURDATE());`
    );

    // Add new week if it's not there
    if (!resultsWeek.data.length) {
      await db(
        `INSERT INTO weeks (start) VALUES (CURDATE() - WEEKDAY(CURDATE()));`
      );
    }

    // Check if product is in database
    const resultsProduct = await db(`SELECT id FROM products
  WHERE name = "${req.body.name}";`);

    console.log("resultsProduct data", resultsProduct.data.length);

    // Add new product if it's not there
    if (!resultsProduct.data.length) {
      await db(`INSERT INTO products (name) VALUES ("${req.body.name}");`);
    }

    // Assign weekId and productId to result of earlier queries or a nested query
    const weekId = resultsWeek.data.length
      ? resultsWeek.data[0].id
      : `(SELECT id FROM weeks WHERE start = CURDATE() - WEEKDAY(CURDATE()))`;

    const productId = resultsProduct.data.length
      ? resultsProduct.data[0].id
      : `(SELECT id FROM products WHERE name = "${req.body.name}")`;

    // Add item to items table
    await db(
      `INSERT INTO items (weekId, productId, userId) VALUES (${weekId}, ${productId}, ${req.decoded.user_id});`
    );
    res.send("Item added");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/items/auto", async (req, res) => {
  //add current week if does not exist
  try {
    await db(`INSERT INTO weeks (start)
  SELECT DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY) 
  WHERE NOT EXISTS (SELECT * FROM weeks 
  WHERE start= DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-2 DAY));
  `);
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
  INTERVAL DAYOFWEEK(CURDATE())-2 DAY)));`);

    //return this week's items
    const results = await db(`SELECT items.id, items.completed,products.name
      FROM items INNER JOIN products 
      ON items.productId=products.id
      WHERE items.weekId=(SELECT id FROM weeks
      WHERE weeks.start=DATE_SUB(CURDATE(),
      INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`);

    res.send(results.data);
  } catch (err) {
    console.log(err);
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
    AND name='${req.body.name}';`);

  //return this week
  const results = await db(`SELECT items.id, items.completed,products.name
      FROM items INNER JOIN products 
      ON items.productId=products.id
      WHERE items.weekId=(SELECT id FROM weeks
      WHERE weeks.start=DATE_SUB(CURDATE(),
      INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`);

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
    .catch((err) => res.status(500).send(err))

    .then(() =>
      db(`SELECT items.id, items.completed,products.name
    FROM items INNER JOIN products 
    ON items.productId=products.id
    WHERE items.weekId=(SELECT id FROM weeks
    WHERE weeks.start=DATE_SUB(CURDATE(),
    INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`)
    )
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => res.status(500).send(err));
});

router.delete("/items", (req, res) => {
  //delete selected item from current week
  db(`DELETE FROM items WHERE id = ${req.body.id};`)
    .catch((err) => res.status(500).send(err))

    .then(() =>
      db(`SELECT items.id, items.completed,products.name
    FROM items INNER JOIN products 
    ON items.productId=products.id
    WHERE items.weekId=(SELECT id FROM weeks
    WHERE weeks.start=DATE_SUB(CURDATE(),
    INTERVAL DAYOFWEEK(CURDATE())-2 DAY));`).then((results) => {
        res.send(results.data);
      })
    );
});

module.exports = router;
