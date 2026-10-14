const express = require("express");
const router = express.Router();
const db = (req) => req.app.locals.db;

router.post("/", async (req, res, next) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    if (!SupplierName) return res.status(400).json({ error: "SupplierName is required." });
    const [result] = await db(req).execute(
      "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)",
      [SupplierName, ContactNumber || null]
    );
    const [rows] = await db(req).execute("SELECT * FROM Suppliers WHERE SupplierID=?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
});

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db(req).query("SELECT * FROM Suppliers ORDER BY SupplierID");
    res.json(rows);
  } catch (error) { next(error); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    if (!SupplierName) return res.status(400).json({ error: "SupplierName is required." });
    const [result] = await db(req).execute(
      "UPDATE Suppliers SET SupplierName=?, ContactNumber=? WHERE SupplierID=?",
      [SupplierName, ContactNumber || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Supplier not found" });
    const [rows] = await db(req).execute("SELECT * FROM Suppliers WHERE SupplierID=?", [req.params.id]);
    res.json(rows[0]);
  } catch (error) { next(error); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const [result] = await db(req).execute("DELETE FROM Suppliers WHERE SupplierID=?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Supplier not found" });
    res.json({ message: "Supplier deleted" });
  } catch (error) { next(error); }
});

module.exports = router;
