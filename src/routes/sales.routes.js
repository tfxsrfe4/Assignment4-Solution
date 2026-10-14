const express = require("express");
const router = express.Router();
const db = (req) => req.app.locals.db;

router.post("/", async (req, res, next) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;
    if (!ProductID || !Number.isInteger(Number(QuantitySold)) || Number(QuantitySold) <= 0 || !SaleDate) {
      return res.status(400).json({ error: "ProductID, positive integer QuantitySold and SaleDate are required." });
    }
    const [result] = await db(req).execute(
      "INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)",
      [ProductID, QuantitySold, SaleDate]
    );
    const [rows] = await db(req).execute("SELECT * FROM Sales WHERE SaleID=?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
});

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db(req).query("SELECT * FROM Sales ORDER BY SaleID");
    res.json(rows);
  } catch (error) { next(error); }
});

router.get("/product/:productId", async (req, res, next) => {
  try {
    const [rows] = await db(req).execute(
      "SELECT * FROM Sales WHERE ProductID=? ORDER BY SaleDate DESC", [req.params.productId]
    );
    res.json(rows);
  } catch (error) { next(error); }
});

module.exports = router;
