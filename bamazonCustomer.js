const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Pajaro24green!",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    listItemsAvail();
});

function listItemsAvail() {
    connection.query("SELECT id, product_name, price FROM products \G ORDER BY id", function (err, res) {
        if (err) throw err;
        console.log(res);
        initialPrompt();

    })
};

function initialPrompt() {
    inquirer
        .prompt([
            {
                name: "purchaseid",
                type: "text",
                message: "What is the ID of the item you want to order?"
            }, {
                name: "numunits",
                type: "integer",
                message: "Quantity?"
            }
          ]).then(function (answer) {
            let productId = answer.purchaseid;
            let productQuantity = answer.numunits;
            console.log("Product ID is " + productId);
            console.log("Quantity requested " + productQuantity);
            // product_name, department_name, price, stock_quantity

            (`SELECT * FROM products WHERE item_id = "${productId}"`, function (err, results) {
				if (err) throw err;
                let productName = results[0].product_name;
                console.log(productName)
				let productPrice = results[0].price;
				if (results[0].stock_quantity >= productQuantity) {
					let updatedQuantity = results[0].stock_quantity - productQuantity;
					updateProduct(productQuantity, updatedQuantity, productId, productName, productPrice);
				} else {
					console.log(`Insufficient quantity! You requested ${productQuantity}, but we only have ${results[0].stock_quantity}. Order canceled.`);
				}
				connection.end();
            });

        })
};

