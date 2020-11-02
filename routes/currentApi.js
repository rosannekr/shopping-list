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
      `SELECT items.id, products.name, items.completed, items.weekId FROM items INNER JOIN products ON items.productId = products.id WHERE items.userId = ${req.decoded.user_id} AND weekId = ${thisWeekId} ORDER BY items.id DESC;`
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

      // Create row values
      const rows = productIds
        .map((e) => `(${thisWeekId}, ${e.id}, ${req.decoded.user_id})`)
        .join(", ");

      // Add new items to database
      await db(`INSERT INTO items (weekId, productId, userId) VALUES ${rows}`);

      // Get this week's items again
      results = await db(
        `SELECT items.id, products.name, items.completed FROM items INNER JOIN products ON items.productId = products.id WHERE items.userId = ${req.decoded.user_id} AND weekId = ${thisWeekId} ORDER BY items.id DESC;`
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

  console.log(req.query);

  // Save nested queries
  const queryProductIds = `SELECT productId FROM items WHERE userId = ${req.decoded.user_id} AND weekId = ${thisWeekId}`;
  const queryLastWeek = `(SELECT weeks.id FROM weeks WHERE start = DATE_SUB(${monday}, INTERVAL 1 WEEK))`;

  // Get most recently bought items
  // set weekId to be last week, skip products that are already in items
  sql = `SELECT DISTINCT items.productId, products.name FROM items INNER JOIN products ON items.productId = products.id WHERE userId = ${req.decoded.user_id} AND weekId = ${queryLastWeek} AND productId NOT IN (${queryProductIds}) LIMIT ${req.query.offset}, 5;`;
  // }

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

/* Update item */
// Changed this to use url param
router.put("/items/:id", userMustBeLoggedIn, async (req, res) => {
  const { prop, value } = req.body;

  try {
    if (prop === "weekId") {
      // Add next week (or skip if it already exists)
      await db(
        `INSERT IGNORE INTO weeks (start) VALUES (DATE_ADD(${monday}, INTERVAL 1 WEEK));`
      );

      // Update weekId of item
      await db(
        `UPDATE items set weekId = (SELECT id FROM weeks WHERE start = DATE_ADD(${monday}, INTERVAL 1 WEEK)) WHERE id = ${req.params.id};`
      );
    } else if (prop === "completed") {
      // Check current status
      if (!value) {
        await db(
          `UPDATE items set completed = CURDATE() WHERE id = ${req.params.id};`
        );
      } else {
        await db(
          `UPDATE items set completed = NULL WHERE id = ${req.params.id};`
        );
      }
    }
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

module.exports = router;
