const fs = require("fs");
const path = require("path");

const rawData = fs.readFileSync(path.join(__dirname, "../model/data.txt"), "UTF-8");
const cleanData = rawData.replace(/[^\w\s]/gi, '').toLowerCase()


//product list
const items = cleanData.split(/\r?\n/).map(e=> e.trim().split(" ").map(e=> e.trim()).filter(e=>e.length>2).join(" "))
const products = []

for (let i=0; i<items.length; i++) {
    if (products.includes(items[i])) continue
    else products.push(items[i])
}

const productsSQL = products.map(e=>
  `INSERT INTO products (name) SELECT '${e}' WHERE NOT EXISTS (SELECT * FROM products WHERE name='${e}');`)

//weeks list
const firstStartDate = ("2020-10-12")
const weeks = []
let tempItems= [...items]

while(tempItems.length) {
    weeks.push(tempItems.splice(0,40));
}

const weeksSQL = (weeks.map((e, i) => {
  e=i
  return `INSERT INTO weeks (start) SELECT DATE_SUB('${firstStartDate}',INTERVAL ${e} week) WHERE NOT EXISTS (SELECT * FROM weeks WHERE start= DATE_SUB('${firstStartDate}',INTERVAL ${e} week));`
}))

//add items

const itemsSQL = items.map( (e, i) => {
  return `INSERT INTO items (weekid, productid) SELECT weeks.id, products.id FROM weeks, products WHERE start=DATE_SUB('${firstStartDate}',INTERVAL ${Math.floor(i/40)} week) AND name='${e}';`
  })

let sql =[productsSQL.join("\n"), weeksSQL.join("\n"), itemsSQL.join("\n")]

fs.writeFileSync(path.join(__dirname, "../model/seed.sql"), sql.join("\n"));



