const express = require("express");
const router = express.Router();

const db = (req) => req.app.locals.db;

router.post("/", async (req, res, next) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    if (!ProductName || Price == null || StockQuantity == null || !SupplierID) {
      return res.status(400).json({ error: "ProductName, Price, StockQuantity and SupplierID are required." });
    }
    const [result] = await db(req).execute(
      "INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)",
      [ProductName, Price, StockQuantity, SupplierID]
    );
    const [rows] = await db(req).execute("SELECT * FROM Products WHERE ProductID = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
});

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db(req).query(`
      SELECT p.*, s.SupplierName
      FROM Products p JOIN Suppliers s ON s.SupplierID = p.SupplierID
      ORDER BY p.ProductID
    `);
    res.json(rows);
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await db(req).execute("SELECT * FROM Products WHERE ProductID = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (error) { next(error); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    if (!ProductName || Price == null || StockQuantity == null || !SupplierID) {
      return res.status(400).json({ error: "ProductName, Price, StockQuantity and SupplierID are required." });
    }
    const [result] = await db(req).execute(
      "UPDATE Products SET ProductName=?, Price=?, StockQuantity=?, SupplierID=? WHERE ProductID=?",
      [ProductName, Price, StockQuantity, SupplierID, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Product not found" });
    const [rows] = await db(req).execute("SELECT * FROM Products WHERE ProductID=?", [req.params.id]);
    res.json(rows[0]);
  } catch (error) { next(error); }
});

router.delete("/eggs", async (req, res, next) => {
  try {
    const [result] = await db(req).execute("DELETE FROM Products WHERE LOWER(ProductName)='eggs'");
    if (!result.affectedRows) return res.status(404).json({ error: "Eggs product not found" });
    res.json({ message: "Eggs product deleted" });
  } catch (error) { next(error); }
});

router.patch("/bread/price", async (req, res, next) => {
  try {
    const price = req.body.price ?? 25;
    const [result] = await db(req).execute(
      "UPDATE Products SET Price=? WHERE LOWER(ProductName)='bread'", [price]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Bread product not found" });
    res.json({ message: "Bread price updated", price: Number(price) });
  } catch (error) { next(error); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const [result] = await db(req).execute("DELETE FROM Products WHERE ProductID=?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) { next(error); }
});

module.exports = router;
