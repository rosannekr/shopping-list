const fs = require("fs");
const path = require("path");
var pluralize = require("pluralize");

//read data
const rawData = fs.readFileSync(
  path.join(__dirname, "../model/data.txt"),
  "UTF-8"
);

//basic clean
const cleanData = rawData.replace(/[^\w\s]/gi, "").toLowerCase();
const items = cleanData.split(/\r?\n/).map((e) =>
  pluralize.singular(
    e
      .trim()
      .split(" ")
      .map((e) => e.trim())
      .filter((e) => e.length > 2)
      .join(" ")
  )
);

//product list (229 products)
const products = [];

for (let i = 0; i < items.length; i++) {
  if (products.includes(items[i])) continue;
  else products.push(items[i]);
}

const productsSQL = products.map(
  (e) => {
    return `INSERT INTO products (name) VALUES ("${e}");`;
  }
  //   `INSERT INTO products (name) SELECT '${e}'
  // WHERE NOT EXISTS (SELECT * FROM products WHERE name='${e}');`
);

console.log(products[0], products[1], products[2]);
console.log(productsSQL.length);

//weeks list
const firstStartDate = "2020-10-12"; // created bug when I tried to use CURDATE()
const weeks = [];
let tempItems = [...items];
let weekLength = 40; //arbitary division point for seed data

// weeks is an array of 10 weeks, with 40 items per week (except for the last one)
while (tempItems.length) {
  weeks.push(tempItems.splice(0, weekLength));
}

const weeksSQL = weeks.map((e, i) => {
  return `INSERT INTO weeks (start) SELECT DATE_SUB(CURDATE() - WEEKDAY(CURDATE()), INTERVAL ${i} week);`;
  // return `INSERT INTO weeks (start) SELECT DATE_SUB('${firstStartDate}',INTERVAL ${i} week)
  // WHERE NOT EXISTS (SELECT * FROM weeks WHERE
  //   start= DATE_SUB('${firstStartDate}',INTERVAL ${i} week));`;
});

//items list
// const itemsSQL = items.map((e, i) => {
//   return `INSERT INTO items (weekid, productid)
//   SELECT weeks.id, products.id FROM weeks, products
//   WHERE start=DATE_SUB('${firstStartDate}',INTERVAL ${Math.floor(
//     i / 40
//   )} week) AND name='${e}';`;
// });

const itemsSQL = items.map((e, i) => {
  return `INSERT INTO items (weekId, productId, userId) VALUES((SELECT id FROM weeks WHERE start = DATE_SUB(CURDATE() - WEEKDAY(CURDATE()), INTERVAL ${Math.floor(
    i / 40
  )} week)), (SELECT id FROM products WHERE name = "${e}"), 1);`;
});

// create users for testing
const usersSQL = [
  `INSERT INTO users (username, password) VALUES ('user1', '$2b$10$.FzHPRlvtV1ZXY/EUsYGae9qCds4P8O08bp1WMB0NsALcqa/cXqfi');`,
  `INSERT INTO users (username, password) VALUES ('user2', '$2b$10$QSslCBJ3/hJe6wCcWKLmuOASS.UHfLDefJ5oRwIe2R7EyYpQLxVMS');`,
];

//write data to SQL file
let sql = [
  usersSQL.join("\n"),
  productsSQL.join("\n"),
  weeksSQL.join("\n"),
  itemsSQL.join("\n"),
];
fs.writeFileSync(path.join(__dirname, "../model/seed.sql"), sql.join("\n"));
