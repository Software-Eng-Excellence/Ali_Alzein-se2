import { IMapper } from "./IMapper";
import { Book } from "../model/Book.model";
import { BookBuilder } from "../model/builders/Book.builder";

export class JsonBookMapper implements IMapper<any, Book>{
    reverseMap(data: Book) {
        throw new Error("Method not implemented.");
    } 
    map(data: any): Book {
        console.log("Mapping book data:", data);
        return BookBuilder.newbuilder()
            .setBookTitle(data['Book Title'])
            .setAuthor(data['Author'])
            .setGenre(data['Genre'])
            .setFormat(data['Format'])
            .setLanguage(data['Language'])
            .setPublisher(data['Publisher'])
            .setSpecialEdition(data['Special Edition'])
            .setPackaging(data['Packaging'])
            .build();
    }
}