import { readXMLFile, logXmlObject } from "../src/parsers/xmlParser";
import { readCSVFile, writeCSVFile } from "../src/parsers/parser";
import { parseJson } from "../src/parsers/jsonParser";
import { promises as fs } from 'fs';
import { IdentifiableToyBuilder, ToyBuilder } from "./../src/model/builders/Toy.builder";
import { BookBuilder, IdentifiableBookBuilder } from "./../src/model/builders/Book.builder";
import { CakeBuilder, IdentifiableCakeBuilder } from "./../src/model/builders/Cake.builder";
import logger from "../src/util/logger";
import { IItem, itemCategory } from "../src/model/IItem";
import {IMapper} from "../src/mappers/IMapper"
import {CSVOrderMapper, JsonOrderMapper, XMLOrderMapper} from "../src/mappers/Order.mapper"
import { IdentifiableBook } from "../src/model/Book.model";
import { IdentifiableOrderItemBuilder } from "../src/model/builders/Order.builder";
import { IdentifiableCake } from "../src/model/Cake.model";
import { IdentifiableOrderItem } from "../src/model/Order.model";
import { IdentifiableToy } from "../src/model/Toy.model";

describe("CSV Parser", () => {
    it("should be defined", async () => {
        //Arrange & Act
        const data = await readCSVFile("src/data/cake orders.csv", true);
        //Assert
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expect(Array.isArray(data[0])).toBe(true);
    });
   
    it("should write CSV file successfully", async () => {
        // Arrange
        const testData = [
            ["Name", "Age", "City"],
            ["Alice", "30", "London"],
            ["Bob", "25", "Paris"]
        ];
        const filePath = "src/data/test_output.csv";
        // Act
        await writeCSVFile(filePath, testData);
        // Assert
        const written =await fs.readFile(filePath, "utf-8");
        expect(written).toContain("Name,Age,City");
        expect(written).toContain("Alice,30,London");
        expect(written).toContain("Bob,25,Paris");
    });
});

describe("XML Parser", () => {
    it("should read and parse XML file correctly", async () => {
        //Arrange & Act
        const data = await readXMLFile("src/data/toy orders.xml");
        //Assert
        expect(data).toBeDefined();
        //expect(data.length).toBeGreaterThan(0);
        //expect(Array.isArray(data[0])).toBe(true);
    })
    it("should convert parsed XML to string matrix", async () => {
        //Arrange
        const data = await readXMLFile("src/data/toy orders.xml");
        //Act
        const stringMatrix = logXmlObject(data);
        //Assert
        expect(stringMatrix).toBeDefined();
        expect(Array.isArray(stringMatrix)).toBe(true);
        expect(stringMatrix.length).toBeGreaterThan(0);              // ensure there's at least one row
        expect(Array.isArray(stringMatrix[0])).toBe(true);          // first row is an array
        expect(stringMatrix[0].length).toBeGreaterThan(0);          // row has at least one cell
        expect(typeof stringMatrix[0][0]).toBe("string"); 
    })
});

describe("Json Parser", () => {
    it("should be defined", async () => {
        //Arrange & Act
        const data = await parseJson("src/data/book orders.json");
        //Assert
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expect(typeof data[0]).toBe("object");
    });

    it("firstString: returns first primitive string from nested arrays/objects", () => {
    // firstString should pick "hello" from mixed nested structure
    const parsed = {
      root: {
        a: [
          { inner: [null, { _: 42 }, "hello"] }, // contains "hello"
          { inner: ["ignored"] }
        ],
      },
    };

    const rows = logXmlObject(parsed);
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);

    // ensure "hello" or "42" appears (firstString should stringify numbers)
    const flat = rows.flat();
    const containsHelloOr42 = flat.some((c) => c === "hello" || c === "42");
    expect(containsHelloOr42).toBe(true);
  });

  it("collectFields: extracts attributes ($) and text (_) and flattens nested keys", () => {
    // Attributes are represented by $ in xml2js; text nodes by _
    const parsed = {
      orders: {
        order: [
          {
            $: { id: 7, kind: "gift" },
            customer: { name: { _: "Sam" }, info: { phone: "555" } },
            note: { _: "fragile" }
          }
        ]
      }
    };

    const rows = logXmlObject(parsed);
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBe(1);

    const row = rows[0];
    // attributes and nested dotted keys should appear somewhere
    const joined = row.join(" ");
    expect(joined).toContain("7");      // attribute id
    expect(joined).toContain("gift");   // attribute kind
    expect(joined).toContain("Sam");    // customer.name via _
    expect(joined).toContain("555");    // nested primitive
    expect(joined).toContain("fragile"); // node text _
  });

  it("traverse + array-of-objects: treats an array of objects as separate rows", () => {
    const parsed = {
      root: {
        product: [
          { name: "X", qty: 1 },
          { name: "Y", qty: 2 },
          { name: "Z", qty: 3 }
        ]
      }
    };

    const rows = logXmlObject(parsed);
    expect(Array.isArray(rows)).toBe(true);
    // should create three row entries (one per product)
    expect(rows.length).toBe(3);

    // ensure names and qtys appear across rows
    const values = rows.flat();
    expect(values).toEqual(expect.arrayContaining(["X", "Y", "Z", "1", "2", "3"].map(String)));
  });

  it("collectFields: when array of objects contains nested objects, nested keys are discovered", () => {
    // array elements have nested arrays/objects — collectFields should recurse and discover nested fields
    const parsed = {
      root: {
        group: [
          {
            person: { name: "Anna", address: { city: "Beirut", zip: 111 } },
            tags: [{ tag: "new" }, { tag: "sale" }]
          },
          {
            person: { name: "Bilal", address: { city: "Tripoli", zip: 222 } }
          }
        ]
      }
    };

    const rows = logXmlObject(parsed);
    expect(rows.length).toBe(2);
    const flat = rows.flat();
    // nested values must be present and stringified
    expect(flat).toEqual(expect.arrayContaining(["Anna", "Beirut", "111", "Bilal", "Tripoli", "222"].map(String)));
  });

  it("firstString + arrays-of-primitives: picks the first primitive element and stringifies numbers", () => {
    const parsed = {
      data: {
        tags: ["one", "two", "three"],
        nums: [10, 20, 30]
      }
    };

    const rows = logXmlObject(parsed);
    expect(rows.length).toBe(1);
    const row = rows[0].join(" ");
    expect(row).toContain("one");
    expect(row).toContain("10");
  });

});

describe("Toy Builder", () => {
  it("should build Toy object correctly", () => {
        // Arrange
        const toyBuilder = new ToyBuilder();
        // Act
        const toy = toyBuilder
            .setType("Action Figure")
            .setAgeGroup("5-10")
            .setBrand("Hasbro")
            .setMaterial("Plastic")
            .setBatteryRequired("true")
            .setEducational("false")
            .build();
        // Assert
        expect(toy).toBeDefined();
        expect(toy.getType()).toBe("Action Figure");
        expect(toy.getAgeGroup()).toBe("5-10");
        expect(toy.getBrand()).toBe("Hasbro");
        expect(toy.getMaterial()).toBe("Plastic");
        expect(toy.isBatteryRequired()).toBe("true");
        expect(toy.isEducational()).toBe("false");
    });
    it("should throw an error and log if a required property is missing", () => {
      // Arrange
      const builder = ToyBuilder.newBuilder()
        .setMaterial("Plastic")
        .setBrand("hasbro");

      const spy = jest.spyOn(logger, "error").mockReturnThis();

      // Act + Assert
      expect(() => builder.build()).toThrow("Missing required property for Toy");
      expect(spy).toHaveBeenCalledWith(
        "Missing required property for Toy, cannot build Toy instance"
      );
    });

    it("should throw if no properties are set", () => {
      const builder = ToyBuilder.newBuilder();
      const spy = jest.spyOn(logger, "error").mockReturnThis();

      expect(() => builder.build()).toThrow("Missing required property for Toy");
      expect(spy).toHaveBeenCalled();
    });

});

describe("BookBuilder", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it("should build Book object correctly", () => {
        // Arrange
        const bookBuilder = new BookBuilder();
        // Act
        const book = bookBuilder
            .setBookTitle("The Great Gatsby")
            .setAuthor("F. Scott Fitzgerald")
            .setGenre("Fiction")
            .setFormat("Hardcover")
            .setLanguage("English")
            .setPublisher("Scribner")
            .setSpecialEdition("Anniversary Edition")
            .setPackaging("Gift Wrap")
            .build();
        // Assert
        expect(book).toBeDefined();
        expect(book.getBookTitle()).toBe("The Great Gatsby");
        expect(book.getAuthor()).toBe("F. Scott Fitzgerald");
        expect(book.getGenre()).toBe("Fiction");
        expect(book.getFormat()).toBe("Hardcover");
        expect(book.getLanguage()).toBe("English");
        expect(book.getPublisher()).toBe("Scribner");
        expect(book.getSpecialEdition()).toBe("Anniversary Edition");
        expect(book.getPackaging()).toBe("Gift Wrap");
    });

    it("should throw an error and log if a required property is missing", () => {
    // Arrange
    const builder = BookBuilder.newbuilder()
      .setBookTitle("The Great Gatsby")
      .setAuthor("F. Scott Fitzgerald");

    const spy = jest.spyOn(logger, "error").mockReturnThis();

    // Act + Assert
    expect(() => builder.build()).toThrow("Missing required property for Book");
    expect(spy).toHaveBeenCalledWith(
      "Missing required property for Book, cannot build Book instance"
    );
  });

    it("should throw if no properties are set", () => {
      const builder = BookBuilder.newbuilder();
      const spy = jest.spyOn(logger, "error").mockReturnThis();

      expect(() => builder.build()).toThrow("Missing required property for Book");
      expect(spy).toHaveBeenCalled();
    });
  });
  
describe("CakeBuilder", () => {

    it("should throw an error and log if a required property is missing", () => {
    // Arrange
    const builder = CakeBuilder.newBuilder()
      .setType("Party")
      .setFlavor("Chocolate");

    const spy = jest.spyOn(logger, "error").mockReturnThis();

    // Act + Assert
    expect(() => builder.build()).toThrow("Missing required property for Cake");
    expect(spy).toHaveBeenCalledWith(
      "Missing required property for Cake, cannot build Cake instance"
    );
  });

    it("should throw if no properties are set", () => {
      const builder = CakeBuilder.newBuilder();
      const spy = jest.spyOn(logger, "error").mockReturnThis();

      expect(() => builder.build()).toThrow("Missing required property for Cake");
      expect(spy).toHaveBeenCalled();
    });

    it("should build Cake object correctly", () => {
        // Arrange
        const cakeBuilder = new CakeBuilder();
        // Act
        const cake = cakeBuilder
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
            .build();
        // Assert
        expect(cake).toBeDefined();
        expect(cake.getType()).toBe("Birthday");
        expect(cake.getFlavor()).toBe("Chocolate");
        expect(cake.getFilling()).toBe("Cream");
        expect(cake.getSize()).toBe(12);
        expect(cake.getLayers()).toBe(2);
        expect(cake.getFrostingType()).toBe("Buttercream");
        expect(cake.getFrostingFlavor()).toBe("Vanilla");
        expect(cake.getDecorationType()).toBe("Sprinkles");
        expect(cake.getDecorationColor()).toBe("Rainbow");
        expect(cake.getCustomMessage()).toBe("Happy Birthday!");
        expect(cake.getShape()).toBe("Round");
        expect(cake.getAllergies()).toBe("Nuts");
        expect(cake.getSpecialIngredients()).toBe("Gluten-Free");
        expect(cake.getPackagingType()).toBe("Box");
    });
  });

describe("JsonOrderMapper", () => {
  let mockItemMapper: jest.Mocked<IMapper<any, IItem>>;

  beforeEach(() => {
    mockItemMapper = {
      map: jest.fn(),
      reverseMap: jest.fn()
    };
  });

  it("should map JSON data into an IOrder", () => {
    // Arrange
    const fakeItem: IItem = {
      getCategory: () => itemCategory.BOOK
    };
    mockItemMapper.map.mockReturnValue(fakeItem);
    const mapper = new JsonOrderMapper(mockItemMapper);
    const jsonInput = {
      "Order ID": "2001",
        "Book Title": "Edge of Eternity",
        "Author": "Dan Brown",
        "Genre": "Science Fiction",
        "Format": "Paperback",
        "Language": "French",
        "Publisher": "Oxford Press",
        "Special Edition": "Signed Copy",
        "Packaging": "Eco-Friendly Packaging",
        "Price": "12",
        "Quantity": "5"
    };
    // Act
    const result = mapper.map(jsonInput);
    // Assert
    expect(mockItemMapper.map).toHaveBeenCalledWith(jsonInput);
    expect(result.getId()).toBe("2001");
    expect(result.getQuantity()).toBe(5);
    expect(result.getPrice()).toBe(12);
    expect(result.getItem()).toBe(fakeItem);
  });
});

describe("CSVOrderMapper", () => {
    let mockItemMapper: jest.Mocked<IMapper<any, IItem>>;

  beforeEach(() => {
    mockItemMapper = {
      map: jest.fn(),
      reverseMap: jest.fn()
    };
  });

  it("should map CSV data into IOrder", () =>{
    // Arrange
    const fakeItem: IItem = {
      getCategory: () => itemCategory.CAKE
    };
    mockItemMapper.map.mockReturnValue(fakeItem);
    const mapper = new CSVOrderMapper(mockItemMapper);
    const csvInput: string[] = ["0","Sponge","Vanilla","Cream","20","2","Buttercream","Vanilla","Sprinkles","Multi-color","Happy Birthday","Round","Nut-Free","Organic Ingredients","Standard Box","50","1"]; 
    // Act
    const result = mapper.map(csvInput);
    // Assert
    expect(mockItemMapper.map).toHaveBeenCalledWith(csvInput);
    expect(result.getId()).toBe("0");
    expect(result.getQuantity()).toBe(1);
    expect(result.getPrice()).toBe(50);
    expect(result.getItem()).toBe(fakeItem);
  });
});

describe("XMLOrderMapper", () => {
    let mockItemMapper: jest.Mocked<IMapper<any, IItem>>;

  beforeEach(() => {
    mockItemMapper = {
      map: jest.fn(),
      reverseMap: jest.fn()
    };
  });

  it("should map XML data into IOrder", () =>{
    // Arrange
    const fakeItem: IItem = {
      getCategory: () => itemCategory.TOY
    };
    mockItemMapper.map.mockReturnValue(fakeItem);
    const mapper = new XMLOrderMapper(mockItemMapper);
    const xmlInput = {
      OrderID: "5001",
      Type: "Plush Toy",
      AgeGroup: "13+",
      Brand: "FunTime",
      Material: "Fabric",
      BatteryRequired: "Yes",
      Educational: "Yes",
      Price: "247",
      Quantity: "7"
    };
    // Act
    const result = mapper.map(xmlInput);
    // Assert
    expect(mockItemMapper.map).toHaveBeenCalledWith(xmlInput);
    expect(result.getId()).toBe("5001");
    expect(result.getQuantity()).toBe(7);
    expect(result.getPrice()).toBe(247);
    expect(result.getItem()).toBe(fakeItem);
  });

});

class MockOrder {
  constructor(private id: string, private qty: number, private price: number) {}
  getId = () => this.id;
  getQuantity = () => this.qty;
  getPrice = () => this.price;
}

class MockItem {
  getCategory = jest.fn();
}

class MockCake {
  getType = jest.fn(() => "Sponge");
  getFlavor = jest.fn(() => "Vanilla");
  getFilling = jest.fn(() => "Cream");
  getSize = jest.fn(() => "Medium");
  getLayers = jest.fn(() => 2);
  getFrostingType = jest.fn(() => "Buttercream");
  getFrostingFlavor = jest.fn(() => "Chocolate");
  getDecorationType = jest.fn(() => "Sprinkles");
  getDecorationColor = jest.fn(() => "Multi");
  getCustomMessage = jest.fn(() => "Happy Birthday");
  getShape = jest.fn(() => "Round");
  getAllergies = jest.fn(() => "Nut-Free");
  getSpecialIngredients = jest.fn(() => "Organic");
  getPackagingType = jest.fn(() => "Box");
}

class MockBook {
  getBookTitle = jest.fn(() => "Inferno");
  getAuthor = jest.fn(() => "Dan Brown");
  getGenre = jest.fn(() => "Thriller");
  getFormat = jest.fn(() => "Hardcover");
  getLanguage = jest.fn(() => "English");
  getPublisher = jest.fn(() => "Penguin");
  getSpecialEdition = jest.fn(() => "Collector");
  getPackaging = jest.fn(() => "Plastic Wrap");
}

class MockToy {
  getType = jest.fn(() => "Plush");
  getAgeGroup = jest.fn(() => "12+");
  getBrand = jest.fn(() => "ToyCo");
  getMaterial = jest.fn(() => "Fabric");
  isBatteryRequired = jest.fn(() => true);
  isEducational = jest.fn(() => false);
}

describe("IdentifiableOrderItemBuilder", () => {
  it("builds an IdentifiableOrderItem correctly", () => {
    const item = new MockItem();
    const order = new MockOrder("1", 3, 100);
    const result = IdentifiableOrderItemBuilder.newBuilder()
      .setItem(item as any)
      .setOrder(order as any)
      .build();

    expect(result).toBeInstanceOf(IdentifiableOrderItem);
    expect(result.getId()).toBe("1");
    expect(result.getQuantity()).toBe(3);
    expect(result.getPrice()).toBe(100);
    expect(result.getItem()).toBe(item);
  });

  it("throws an error if missing properties", () => {
    const builder = IdentifiableOrderItemBuilder.newBuilder();
    expect(() => builder.build()).toThrow("Missing required properties");
  });
});

describe("IdentifiableCakeBuilder", () => {
  it("builds an IdentifiableCake correctly", () => {
    const cake = new MockCake();
    const result = IdentifiableCakeBuilder.newBuilder()
      .setId("cake1")
      .setCake(cake as any)
      .build();

    expect(result).toBeInstanceOf(IdentifiableCake);
    expect(result.getId()).toBe("cake1");
    expect(result.getFlavor()).toBe("Vanilla");
  });

  it("throws an error when required properties missing", () => {
    const builder = IdentifiableCakeBuilder.newBuilder();
    expect(() => builder.build()).toThrow("Missing required property");
  });
});

describe("IdentifiableBookBuilder", () => {
  it("builds an IdentifiableBook correctly", () => {
    const book = new MockBook();
    const result = IdentifiableBookBuilder.newBuilder()
      .setId("b1")
      .setBook(book as any)
      .build();

    expect(result).toBeInstanceOf(IdentifiableBook);
    expect(result.getId()).toBe("b1");
    expect(result.getBookTitle()).toBe("Inferno");
  });

  it("throws error when id or book missing", () => {
    const builder = IdentifiableBookBuilder.newBuilder();
    expect(() => builder.build()).toThrow("Missing required property");
  });
});

describe("IdentifiableToyBuilder", () => {
  it("builds an IdentifiableToy correctly", () => {
    const toy = new MockToy();
    const result = IdentifiableToyBuilder.newBuilder()
      .setId("toy1")
      .setToy(toy as any)
      .build();

    expect(result).toBeInstanceOf(IdentifiableToy);
    expect(result.getId()).toBe("toy1");
    expect(result.getType()).toBe("Plush");
  });

  it("throws an error if required fields missing", () => {
    const builder = IdentifiableToyBuilder.newBuilder();
    expect(() => builder.build()).toThrow("Missing required property");
  });
});
