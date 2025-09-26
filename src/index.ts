import { ToyBuilder } from "./model/builders/Toy.builder";
import { BookBuilder } from "./model/builders/Book.builder";
import { CakeBuilder } from "./model/builders/Cake.builder";

async function main() {
  const cakeBuilder= new CakeBuilder();
  const cake =cakeBuilder
    .setId(1)
    .setType("Birthday")
    .setFlavor("Chocolate")
    .setFilling("Cream")
    .setSize(12)
    .setLayers(2)
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Vanilla")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Rainbow")
    .setCustomMessage("Happy Birthday!")
    .setShape("Round")
    .setAllergies("Nuts")
    .setSpecialIngredients("Gluten-Free")
    .setPackagingType("Box")
    .setPrice(49.99)
    .setQuantity(1)
    .build();
  console.log(cake);

  const bookBuilder= new BookBuilder();
  const book = bookBuilder
    .setOrderId("ORD12345")
    .setBookTitle("The Great Gatsby")
    .setAuthor("F. Scott Fitzgerald")
    .setGenre("Fiction")
    .setFormat("Hardcover")
    .setLanguage("English")
    .setPublisher("Scribner")
    .setSpecialEdition("Anniversary Edition")
    .setPackaging("Gift Wrap")
    .setPrice(29.99)
    .setQuantity(1)
    .build();
  console.log(book);

  const toyBuilder= new ToyBuilder();
  const toy = toyBuilder
    .setOrderId(1001)
    .setType("Action Figure")
    .setAgeGroup("5-10")
    .setBrand("Hasbro")
    .setMaterial("Plastic")
    .setBatteryRequired(true)
    .setEducational(false)
    .setPrice(19.99)
    .setQuantity(2)
    .build();
  console.log(toy);  
}

main();