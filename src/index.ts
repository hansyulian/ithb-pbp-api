import { createApp } from "~/app";

const PORT = 33333;

async function init() {
  const app = await createApp({});
  app.listen(PORT);
  console.log("API started at port", PORT);
}
init();
