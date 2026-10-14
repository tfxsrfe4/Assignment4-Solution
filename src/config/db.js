const mysql = require("mysql2/promise");
require("dotenv").config();

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

const databaseName = process.env.DB_NAME || "retail_store";

async function initializeDatabase() {
  // Connect without selecting a database so we can create it if needed.
  const connection = await mysql.createConnection(config);
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${databaseName.replace(/`/g, "")}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.end();

  const pool = mysql.createPool({
    ...config,
    database: databaseName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Suppliers (
      SupplierID INT PRIMARY KEY AUTO_INCREMENT,
      SupplierName VARCHAR(100) NOT NULL,
      ContactNumber VARCHAR(15)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Products (
      ProductID INT PRIMARY KEY AUTO_INCREMENT,
      ProductName VARCHAR(100) NOT NULL,
      Price DECIMAL(10,2) NOT NULL,
      StockQuantity INT NOT NULL DEFAULT 0,
      SupplierID INT NOT NULL,
      CONSTRAINT fk_products_supplier
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
        ON UPDATE CASCADE ON DELETE RESTRICT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Sales (
      SaleID INT PRIMARY KEY AUTO_INCREMENT,
      ProductID INT NOT NULL,
      QuantitySold INT NOT NULL,
      SaleDate DATE NOT NULL,
      CONSTRAINT fk_sales_product
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
        ON UPDATE CASCADE ON DELETE RESTRICT
    )
  `);

  return pool;
}

module.exports = { initializeDatabase };
