import { createApp } from "./app";
import { env } from "./config/env";
import { appDataSource } from "./db/data-source";

async function bootstrap() {
  await appDataSource.initialize();

  const app = createApp(appDataSource);

  app.listen(env.port, () => {
    console.log(`Habita API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
