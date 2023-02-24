import "./loadEnvironment.js";
import chalk from "chalk";
import createDebug from "debug";
import startServer from "./server/startServer.js";

const debug = createDebug("social:*");

const port = process.env.PORT ?? 4000;

try {
  await startServer(+port);
  debug(chalk.green(`Server listening on port ${port}`));
} catch (error) {
  debug(error.message);
}
