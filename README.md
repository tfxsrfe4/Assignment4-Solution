# Assignment 4 — Retail Store REST API

## Requirements
- Node.js 18+
- MySQL Server running locally

## Run
1. Copy `.env.example` to `.env` and enter your MySQL credentials.
2. From this folder run `npm install`.
3. Run `npm run dev` (or `npm start`). The app creates the database and tables automatically.
4. Base URL: `http://localhost:3000`.

## Endpoints

### Products
- `POST /api/products` body: `{ "ProductName":"Coffee", "Price":12.5, "StockQuantity":20, "SupplierID":1 }`
- `GET /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `PATCH /api/products/bread/price` body: `{ "price":25 }`
- `DELETE /api/products/eggs`
- `GET /api/reports/total-sold`
- `GET /api/reports/highest-stock`
- `GET /api/reports/never-sold`

### Suppliers
- `POST /api/suppliers` body: `{ "SupplierName":"FreshFoods", "ContactNumber":"01001234567" }`
- `GET /api/suppliers`
- `PUT /api/suppliers/:id`
- `DELETE /api/suppliers/:id`
- `GET /api/reports/suppliers-starting-f`

### Sales
- `POST /api/sales` body: `{ "ProductID":1, "QuantitySold":2, "SaleDate":"2025-05-20" }`
- `GET /api/sales`
- `GET /api/sales/product/:productId`
- `GET /api/reports/sales-details`

### Schema modification endpoints (use only for assignment/demo)
- `POST /api/admin/products/add-category`
- `DELETE /api/admin/products/remove-category`
- `PATCH /api/admin/suppliers/contact-number`
- `POST /api/admin/products/product-name-not-null`

### Seed and permissions
- `POST /api/admin/seed` inserts FreshFoods, Milk, Bread, Eggs and the Milk sale. It is safe to run repeatedly.
- `sql/admin-permissions.sql` creates `store_manager` and demonstrates grant/revoke/grant. Edit its password before running.

## Notes
- This assignment uses MySQL as requested in the PDF, not SQL Server.
- Do not expose administrative endpoints publicly in a real production app; protect them with authentication/authorization.
- Deleting a product referenced by a sale is prevented by the foreign key. The app returns an explanatory error rather than deleting sale history.
