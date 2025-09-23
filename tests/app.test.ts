import { readXMLFile, logXmlObject } from "../src/parsers/xmlParser";
import { readCSVFile, writeCSVFile } from "../src/parsers/parser";
import { parseJson } from "../src/parsers/jsonParser";
import { promises as fs } from 'fs';

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