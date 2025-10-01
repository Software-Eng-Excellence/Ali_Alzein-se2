import logger from "./util/logger";
import { readXMLFile } from "./parsers/xmlParser";
import { readCSVFile } from "./parsers/parser";
import { parseJson } from "./parsers/jsonParser";
import { CSVCakeMapper } from "./mappers/Cake.mapper";
import { XMLToyMapper } from "./mappers/Toy.mapper";
import { JsonBookMapper } from "./mappers/book.mapper";
import { CSVOrderMapper, JsonOrderMapper, XMLOrderMapper } from "./mappers/Order.mapper";

async function main() {

  const data = await readCSVFile("src/data/cake orders.csv");
  const cakeMapper = new CSVCakeMapper();
  const orderMapper = new CSVOrderMapper(cakeMapper);
  const orders = data.map(orderMapper.map.bind(orderMapper));
  logger.info("Cakes from CSV: \n, %o", orders);

  const jsonData = await parseJson("src/data/book orders.json");
  const bookMapper = new JsonBookMapper();
  const orderMapper3 = new JsonOrderMapper(bookMapper);
  const orders3 = jsonData.map(orderMapper3.map.bind(orderMapper3));
  logger.info("Books from JSON: \n, %o", orders3);

  const xmldata = await readXMLFile("src/data/toy orders.xml");
  console.log("xmlData:", xmldata);
  const toyMapper = new XMLToyMapper();
  const orderMapper2 = new XMLOrderMapper(toyMapper);
  const rows = xmldata.data.row; 
  const orders2 = rows.map((row: any) => orderMapper2.map(row));
  logger.info("Toys from XML: \n %o", orders2);
}

main();