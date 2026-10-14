const app = require("./app");
const { initializeDatabase } = require("./config/db");

const port = Number(process.env.PORT || 3000);

initializeDatabase()
  .then((pool) => {
    // Keep one shared pool available to route handlers.
    app.locals.db = pool;
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Database initialization failed:");
    console.error(error);
    console.error("Check that MySQL Server is running and that .env contains the correct DB_HOST, DB_PORT, DB_USER, and DB_PASSWORD.");
    process.exit(1);
  });
