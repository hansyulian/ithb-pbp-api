import { createApp } from "~/app";
import { setupDatabase } from "~/lib/sequelize";

const PORT = 33333;

async function init() {
  const app = await createApp({
    sequelizeInstance: setupDatabase(),
  });
  app.listen(PORT);
  console.log("API started at port", PORT);
}
init();
