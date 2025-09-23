import logger from "./util/logger";
import { readCSVFile } from "./parsers/parser";
import { readXMLFile, logXmlObject } from "./parsers/xmlParser";
import { parseJson } from "./parsers/jsonParser";

async function main() {
  const csvData = await readCSVFile("src/data/cake orders.csv", true);
  csvData.forEach((row) => logger.info(row));
  const XMLdata = await readXMLFile("src/data/toy orders.xml");
  const XMLRows = logXmlObject(XMLdata);
  XMLRows.forEach(async (row) => {
  logger.info(JSON.stringify(row));
  const jsonData= await parseJson("src/data/book orders.json");
  jsonData.forEach((row) => logger.info(JSON.stringify(row)));
});
}

main();