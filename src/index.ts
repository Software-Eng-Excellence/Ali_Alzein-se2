import logger from "./util/logger";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/Cake.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/builders/Order.builder";
import { BookBuilder, IdentifiableBookBuilder } from "./model/builders/Book.builder";
import { IdentifiableToyBuilder, ToyBuilder } from "./model/builders/Toy.builder";
import { DBMode, RepositoryFactory } from "./repository/Repository.factory";
import { itemCategory } from "./model/IItem";


  async function DBSandBox(){
    const dbOrder = await RepositoryFactory.create(DBMode.POSTGRESQL ,itemCategory.CAKE);
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
    await dbOrder.delete(idOrder.getId());
    await dbOrder.update(idOrder);
    console.log((await dbOrder.getAll()).length);

    const dbOrder2 = await RepositoryFactory.create(DBMode.POSTGRESQL ,itemCategory.BOOK);
    const book = BookBuilder.newbuilder()
      .setBookTitle("Tinky Winky")
      .setAuthor("Ali Alzein")
      .setGenre("Action")
      .setFormat("britan")
      .setLanguage("English")
      .setPublisher("Pb")
      .setSpecialEdition("Premuim")
      .setPackaging("Box")
      .build();
    
    const idBook = IdentifiableBookBuilder.newBuilder()
      .setBook(book)
      .setId(Math.random().toString(36).substring(2, 15))
      .build();

    const order2 = OrderBuilder.newBuilder()
      .setItem(book)
      .setQuantity(1)
      .setPrice(50)
      .setId(Math.random().toString(36).substring(2, 15))
      .build();

    const idOrder2 = IdentifiableOrderItemBuilder.newBuilder().setItem(idBook).setOrder(order2).build();
    await dbOrder2.create(idOrder2);
    console.log(idOrder2.getId());
    await dbOrder2.delete(idOrder2.getId());
    await dbOrder2.update(idOrder2);
    console.log((await dbOrder2.getAll()).length);   
    
    const dbOrder3 = await RepositoryFactory.create(DBMode.POSTGRESQL ,itemCategory.TOY);
    const toy = ToyBuilder.newBuilder()
      .setType("puzzle")
      .setAgeGroup("5-10")
      .setBrand("lego")
      .setMaterial("plastic")
      .setBatteryRequired("No")
      .setEducational("No")
      .build();

    const idToy = IdentifiableToyBuilder.newBuilder()
      .setToy(toy)
      .setId(Math.random().toString(36).substring(2, 15))
      .build();

    const order3 = OrderBuilder.newBuilder()
      .setItem(toy)
      .setQuantity(1)
      .setPrice(50)
      .setId(Math.random().toString(36).substring(2, 15))
      .build();

    const idOrder3 = IdentifiableOrderItemBuilder.newBuilder().setItem(idToy).setOrder(order3).build();
    await dbOrder3.create(idOrder3);
    console.log(idOrder3.getId());
    await dbOrder3.delete(idOrder3.getId());
    await dbOrder3.update(idOrder3);
    console.log((await dbOrder3.getAll()).length);


  }
DBSandBox().catch((error) => logger.error("Error in DBSandBox: %o", error));
