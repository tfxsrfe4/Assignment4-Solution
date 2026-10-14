const express = require("express");
const router = express.Router();
const db = (req) => req.app.locals.db;

// Total quantity sold for each product, including products with zero sales.
router.get("/total-sold", async (req, res, next) => {
  try {
    const [rows] = await db(req).query(`
      SELECT p.ProductID, p.ProductName, COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
      FROM Products p LEFT JOIN Sales s ON s.ProductID = p.ProductID
      GROUP BY p.ProductID, p.ProductName
      ORDER BY p.ProductID
    `);
    res.json(rows);
  } catch (error) { next(error); }
});

router.get("/highest-stock", async (req, res, next) => {
  try {
    const [rows] = await db(req).query(
      "SELECT * FROM Products WHERE StockQuantity=(SELECT MAX(StockQuantity) FROM Products)"
    );
    res.json(rows);
  } catch (error) { next(error); }
});

router.get("/suppliers-starting-f", async (req, res, next) => {
  try {
    const [rows] = await db(req).query("SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'");
    res.json(rows);
  } catch (error) { next(error); }
});

router.get("/never-sold", async (req, res, next) => {
  try {
    const [rows] = await db(req).query(`
      SELECT p.* FROM Products p
      WHERE NOT EXISTS (SELECT 1 FROM Sales s WHERE s.ProductID=p.ProductID)
    `);
    res.json(rows);
  } catch (error) { next(error); }
});

router.get("/sales-details", async (req, res, next) => {
  try {
    const [rows] = await db(req).query(`
      SELECT p.ProductName, s.QuantitySold, s.SaleDate
      FROM Sales s JOIN Products p ON p.ProductID=s.ProductID
      ORDER BY s.SaleDate DESC, s.SaleID DESC
    `);
    res.json(rows);
  } catch (error) { next(error); }
});

module.exports = router;
