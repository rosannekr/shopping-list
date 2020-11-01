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

const productsSQL = products.map((e) => {
  return `INSERT INTO products (name) VALUES ("${e}");`;
});

//weeks list
const firstStartDate = "2020-10-12"; // created bug when I tried to use CURDATE()
const weeks = [];
let tempItems = [...items];
let weekLength = 40; //arbitary division point for seed data

// array of 10 weeks, with 40 items per week (except for the last one)
while (tempItems.length) {
  weeks.push(tempItems.splice(0, weekLength));
}

// get date of last monday
const monday = `DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`;
// start from last week and count backwards
const weeksSQL = weeks.map(
  (e, i) =>
    `INSERT INTO weeks (start) SELECT DATE_SUB(${monday}, INTERVAL ${
      i + 1
    } week);`
);

//items list
const itemsSQL = items.map(
  (e, i) =>
    `INSERT INTO items (weekId, productId, userId) VALUES((SELECT id FROM weeks WHERE start = DATE_SUB(${monday}, INTERVAL ${
      Math.floor(i / 40) + 1
    } week)), (SELECT id FROM products WHERE name = "${e}"), 1);`
);

// users
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
