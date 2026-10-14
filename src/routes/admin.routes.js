const express = require("express");
const router = express.Router();
const db = (req) => req.app.locals.db;

// These schema-changing endpoints are included for the assignment.
// In a real application, protect them with admin authentication.
router.post("/products/add-category", async (req, res, next) => {
  try {
    await db(req).query("ALTER TABLE Products ADD COLUMN Category VARCHAR(100) NULL");
    res.json({ message: "Category column added" });
  } catch (error) {
    if (error.code === "ER_DUP_FIELDNAME") return res.status(409).json({ error: "Category already exists" });
    next(error);
  }
});

router.delete("/products/remove-category", async (req, res, next) => {
  try {
    await db(req).query("ALTER TABLE Products DROP COLUMN Category");
    res.json({ message: "Category column removed" });
  } catch (error) {
    if (error.code === "ER_BAD_FIELD_ERROR") return res.status(404).json({ error: "Category column does not exist" });
    next(error);
  }
});

router.patch("/suppliers/contact-number", async (req, res, next) => {
  try {
    await db(req).query("ALTER TABLE Suppliers MODIFY COLUMN ContactNumber VARCHAR(15)");
    res.json({ message: "ContactNumber changed to VARCHAR(15)" });
  } catch (error) { next(error); }
});

router.post("/products/product-name-not-null", async (req, res, next) => {
  try {
    await db(req).query("UPDATE Products SET ProductName='Unnamed' WHERE ProductName IS NULL");
    await db(req).query("ALTER TABLE Products MODIFY COLUMN ProductName VARCHAR(100) NOT NULL");
    res.json({ message: "ProductName is now NOT NULL" });
  } catch (error) { next(error); }
});

router.post("/seed", async (req, res, next) => {
  const connection = await db(req).getConnection();
  try {
    await connection.beginTransaction();
    const [supplierRows] = await connection.execute(
      "SELECT SupplierID FROM Suppliers WHERE SupplierName='FreshFoods' AND ContactNumber='01001234567' LIMIT 1"
    );
    let supplierId;
    if (supplierRows.length) supplierId = supplierRows[0].SupplierID;
    else {
      const [supplier] = await connection.execute(
        "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)",
        ["FreshFoods", "01001234567"]
      );
      supplierId = supplier.insertId;
    }

    const productData = [
      ["Milk", 15.00, 50],
      ["Bread", 10.00, 30],
      ["Eggs", 20.00, 40],
    ];
    const productIds = {};
    for (const [name, price, stock] of productData) {
      const [existing] = await connection.execute(
        "SELECT ProductID FROM Products WHERE ProductName=? AND SupplierID=? LIMIT 1", [name, supplierId]
      );
      if (existing.length) productIds[name] = existing[0].ProductID;
      else {
        const [inserted] = await connection.execute(
          "INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)",
          [name, price, stock, supplierId]
        );
        productIds[name] = inserted.insertId;
      }
    }
    const [saleExists] = await connection.execute(
      "SELECT SaleID FROM Sales WHERE ProductID=? AND QuantitySold=2 AND SaleDate='2025-05-20' LIMIT 1",
      [productIds.Milk]
    );
    if (!saleExists.length) {
      await connection.execute(
        "INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, 2, '2025-05-20')",
        [productIds.Milk]
      );
    }
    await connection.commit();
    res.status(201).json({ message: "Seed data inserted (existing matching records were reused)", supplierId, productIds });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

module.exports = router;
