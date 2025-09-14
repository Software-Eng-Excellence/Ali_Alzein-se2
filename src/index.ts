import logger from "./util/logger";
import { readCSVFile } from "./util/parser";


async function main() {
  const data = await readCSVFile("src/data/cake_orders.csv", true);
  data.forEach((row) => logger.info(row));
}

main();