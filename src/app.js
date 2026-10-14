const express = require("express");
const products = require("./routes/products.routes");
const suppliers = require("./routes/suppliers.routes");
const sales = require("./routes/sales.routes");
const admin = require("./routes/admin.routes");
const reports = require("./routes/reports.routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Retail Store API is running" });
});
app.use("/api/products", products);
app.use("/api/suppliers", suppliers);
app.use("/api/sales", sales);
app.use("/api/admin", admin);
app.use("/api/reports", reports);

app.use((req, res) => res.status(404).json({ error: "Endpoint not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ error: "The referenced supplier or product does not exist." });
  }
  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({ error: "Cannot delete this record because another record references it." });
  }
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
