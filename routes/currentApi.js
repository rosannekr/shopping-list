var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const db = require("../model/helper");

const userMustBeLoggedIn = require("../guards/userMustBeLoggedIn");

router.use(bodyParser.json());

// Create date variables
const monday = `DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`;
const thisWeekId = `(SELECT weeks.id FROM weeks WHERE start = ${monday})`;

/* Get this week's items */
router.get("/items", userMustBeLoggedIn, async (req, res) => {
  try {
    // Get this week's items
    let results = await db(
      `SELECT items.id, products.name, items.completed FROM items INNER JOIN products ON items.productId = products.id WHERE items.userId = ${req.decoded.user_id} AND weekId = ${thisWeekId};`
    );

    // If no results, generate new items
    if (!results.data.length) {
      // Add new week (or skip if it already exists)
      await db(`INSERT IGNORE INTO weeks (start) VALUES (${monday});`);

      // Get id's of most frequently bought products
      const resultsIds = await db(
        `SELECT products.id FROM items INNER JOIN products ON items.productId = products.id WHERE items.userId = ${req.decoded.user_id} GROUP BY items.productId ORDER BY COUNT(items.id) DESC LIMIT 40;`
      );
      const productIds = resultsIds.data;

      console.log("product ids", productIds);

      // Create row values
      const rows = productIds
        .map((e) => `(${thisWeekId}, ${e.id}, ${req.decoded.user_id})`)
        .join(", ");

      console.log("rows", rows);

      // Add new items to database
      await db(`INSERT INTO items (weekId, productId, userId) VALUES ${rows}`);

      // Get this week's items again
      results = await db(
        `SELECT items.id, products.name, items.completed FROM items INNER JOIN products ON items.productId = products.id WHERE items.userId = ${req.decoded.user_id} AND weekId = ${thisWeekId};`
      );
    }
    res.send(results.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

/* Get suggestions for this week's list */
router.get("/suggestions", userMustBeLoggedIn, async (req, res) => {
  let sql = "";

  // Change query based on query parameter
  if (req.query.filter === "frequent") {
    // Get most frequently bought items: count how many times products occur in items table
    sql = `SELECT products.id FROM items INNER JOIN products ON items.productId = products.id WHERE items.userId = ${req.decoded.user_id} GROUP BY items.productId ORDER BY COUNT(items.id) DESC LIMIT 30;`;
  } else if (req.query.filter === "recent") {
    // Get most recently bought items: set weekId to be last week
    sql = `SELECT DISTINCT products.id FROM items INNER JOIN products ON items.productId = products.id WHERE items.userId = ${req.decoded.user_id} AND weekId = (SELECT weeks.id FROM weeks WHERE start = DATE_SUB(${monday}, INTERVAL 1 WEEK));`;
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
    // Add new product to database (or skip if it already exists)
    await db(`INSERT IGNORE INTO products (name) VALUES ("${req.body.name}");`);

    // Save query for product id
    const productId = `(SELECT id FROM products WHERE name = "${req.body.name}")`;

    // Add item to items table
    await db(
      `INSERT INTO items (weekId, productId, userId) VALUES (${thisWeekId}, ${productId}, ${req.decoded.user_id});`
    );
    res.send("Item added");
  } catch (error) {
    res.status(500).send(error);
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

/* Update item */
// Changed this to use url param
router.put("/items/:id", userMustBeLoggedIn, async (req, res) => {
  try {
    if (req.query.prop === "weekId") {
      // Save query to get current week
      const currentWeek = `SELECT start FROM weeks WHERE id = (SELECT weekId FROM items WHERE id = ${req.params.id})`;

      // Add next week (or skip if it already exists)
      await db(
        `INSERT IGNORE INTO weeks (start) VALUES (DATE_ADD(${currentWeek}, INTERVAL 1 WEEK));`
      );

      // Save query to get id of next week
      const weekId = `(SELECT id FROM weeks WHERE start = DATE_ADD(${currentWeek}, INTERVAL 1 WEEK))`;

      await db(
        `UPDATE items set ${req.query.prop} = ${weekId} WHERE id = ${req.params.id};`
      );
    }

    // Check current status
    // if (!req.body.status) {
    //   await db(
    //     `UPDATE items set completed = CURDATE() WHERE id = ${req.params.id};`
    //   );
    // } else {
    //   await db(
    //     `UPDATE items set completed = NULL WHERE id = ${req.params.id};`
    //   );
    // }

    res.send("Item updated");
  } catch (error) {
    res.status(500).send(error);
  }
});

/* Delete item from current week */
// Changed this to use url param
router.delete("/items/:id", userMustBeLoggedIn, async (req, res) => {
  try {
    await db(`DELETE FROM items WHERE id = ${req.params.id}`);
    res.send("Item deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
