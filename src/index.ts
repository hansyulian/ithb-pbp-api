import { createApp } from "~/app";
import { appConfig } from "~/config";
import { setupDatabase } from "~/lib/sequelize";

async function init() {
  const app = await createApp({
    sequelizeInstance: setupDatabase(),
  });
  app.listen(appConfig.api.port);
  console.log("API started at port", appConfig.api.port);
}
init();
