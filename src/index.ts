import logger from "./util/logger";
import { readXMLFile } from "./parsers/xmlParser";
import { parseJson } from "./parsers/jsonParser";
import { XMLToyMapper } from "./mappers/Toy.mapper";
import { JsonBookMapper } from "./mappers/book.mapper";
import { CSVOrderMapper, JsonOrderMapper, XMLOrderMapper } from "./mappers/Order.mapper";
import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
import config from "./config";
import { OrderRepository } from "./repository/sqlite/Order.repository";
import { CakeRepository } from "./repository/sqlite/Cake.order.repository";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/Cake.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/builders/Order.builder";
import { error } from "winston";

async function main() {

  const path =config.storagePath.csv.cake;
  const repository = new CakeOrderRepository(path);
  const data = await repository.get("1");
  logger.info("Cakes from CSV: \n, %o", data);


  // const jsonData = await parseJson("src/data/book orders.json");
  // const bookMapper = new JsonBookMapper();
  // const orderMapper3 = new JsonOrderMapper(bookMapper);
  // const orders3 = jsonData.map(orderMapper3.map.bind(orderMapper3));
  // logger.info("Books from JSON: \n, %o", orders3);

  // const xmldata = await readXMLFile("src/data/toy orders.xml");
  // console.log("xmlData:", xmldata);
  // const toyMapper = new XMLToyMapper();
  // const orderMapper2 = new XMLOrderMapper(toyMapper);
  // const rows = xmldata.data.row; 
  // const orders2 = rows.map((row: any) => orderMapper2.map(row));
  // logger.info("Toys from XML: \n %o", orders2);
}

  async function DBSandBox(){
    const dbOrder = new OrderRepository( new CakeRepository());
    await dbOrder.init();
    //Create identifiable cake
    const cake = CakeBuilder.newBuilder()
    .setType("Birthday")
    .setFlavor("Chocolate")
    .setFilling("Vanilla")
    .setSize(8)
    .setLayers(2)
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Chocolate")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Multi-color")
    .setCustomMessage("Happy Birthday!")
    .setShape("Round")
    .setAllergies("Nuts")
    .setSpecialIngredients("Organic Eggs")
    .setPackagingType("Box")
    .build();

    const idCake = IdentifiableCakeBuilder.newBuilder()
    .setCake(cake)
    .setId(Math.random().toString(36).substring(2, 15))
    .build();
    //create identifiable order

    const order = OrderBuilder.newBuilder()
    .setItem(cake)
    .setQuantity(1)
    .setPrice(50)
    .setId(Math.random().toString(36).substring(2, 15))
    .build();

  const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItem(idCake).setOrder(order).build();
  await dbOrder.create(idOrder);
  console.log(idOrder.getId());
//  await dbOrder.delete(idOrder.getId());
  await dbOrder.update(idOrder);
  console.log((await dbOrder.getAll()).length);
  }
//main();
DBSandBox().catch((error) => logger.error("Error in DBSandBox: %o", error));