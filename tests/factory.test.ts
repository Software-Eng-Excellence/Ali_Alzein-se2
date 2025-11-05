import { SQLiteOrderMapper, CSVOrderMapper, JsonOrderMapper, XMLOrderMapper } from "../src/mappers/Order.mapper";
import { itemCategory } from "../src/model/IItem";
import { DBMode } from "../src/repository/Repository.factory";
import { MapperFactory } from "../src/mappers/Factory/OrderMapper.factory"
import { CakeMapperFactory } from "../src/mappers/Factory/CakeMapper.factory"
import { BookMapperFactory } from "../src/mappers/Factory/BookMapper.factory"
import { ToyMapperFactory } from "../src/mappers/Factory/ToyMapper.factory"

jest.mock("../src/mappers/Factory/CakeMapper.factory", () => ({
  CakeMapperFactory: { create: jest.fn(() => ({ mapper: "cake" })) }
}));

jest.mock("../src/mappers/Factory/BookMapper.factory", () => ({
  BookMapperFactory: { create: jest.fn(() => ({ mapper: "book" })) }
}));

jest.mock("../src/mappers/Factory/ToyMapper.factory", () => ({
  ToyMapperFactory: { create: jest.fn(() => ({ mapper: "toy" })) }
}));
describe("MapperFactory.createOrderMapper", () => {
    
  it("should return SQLiteOrderMapper when DBMode is SQLITE", () => {
    const mapper = MapperFactory.createOrderMapper(DBMode.SQLITE, itemCategory.CAKE);
    expect(mapper).toBeInstanceOf(SQLiteOrderMapper);
  });

  it("should call CakeMapperFactory for CAKE category", () => {
    MapperFactory.createOrderMapper(DBMode.FILE, itemCategory.CAKE);
    expect(CakeMapperFactory.create).toHaveBeenCalled();
  });

  it("should call BookMapperFactory for BOOK category", () => {
    MapperFactory.createOrderMapper(DBMode.FILE, itemCategory.BOOK);
    expect(BookMapperFactory.create).toHaveBeenCalled();
  });

  it("should call ToyMapperFactory for TOY category", () => {
    MapperFactory.createOrderMapper(DBMode.FILE, itemCategory.TOY);
    expect(ToyMapperFactory.create).toHaveBeenCalled();
  });

  it("should return CSVOrderMapper for FILE + CAKE", () => {
    const mapper = MapperFactory.createOrderMapper(DBMode.FILE, itemCategory.CAKE);
    expect(mapper).toBeInstanceOf(CSVOrderMapper);
  });

  it("should return JsonOrderMapper for FILE + BOOK", () => {
    const mapper = MapperFactory.createOrderMapper(DBMode.FILE, itemCategory.BOOK);
    expect(mapper).toBeInstanceOf(JsonOrderMapper);
  });

  it("should return XMLOrderMapper for FILE + TOY", () => {
    const mapper = MapperFactory.createOrderMapper(DBMode.FILE, itemCategory.TOY);
    expect(mapper).toBeInstanceOf(XMLOrderMapper);
  });

  it("should throw error on unsupported category", () => {
    // @ts-ignore we test runtime behavior
    expect(() => MapperFactory.createOrderMapper(DBMode.FILE, 999)).toThrow("Unsupported item category.");
  });

  it("should throw error on unsupported DB mode", () => {
    // @ts-ignore
    expect(() => MapperFactory.createOrderMapper(999, itemCategory.CAKE)).toThrow("Unsupported Database mode for OrderMapper");
  });
});
