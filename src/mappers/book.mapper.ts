import { IMapper } from "./IMapper";
import { Book, IdentifiableBook } from "../model/Book.model";
import { BookBuilder, IdentifiableBookBuilder } from "../model/builders/Book.builder";

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

export interface SQLiteBook {
    id: string;
    booktitle: string;
    author: string;
    genre: string;
    format: string;
    language: string;
    publisher: string;
    specialedition: string;
    packaging: string;
}

export class SQLiteBookMapper implements IMapper<SQLiteBook, IdentifiableBook> {
    map(data: SQLiteBook): IdentifiableBook {
        return IdentifiableBookBuilder.newBuilder()
            .setBook(BookBuilder.newbuilder()
                .setBookTitle(data.booktitle)
                .setAuthor(data.author)
                .setGenre(data.genre)
                .setFormat(data.format)
                .setLanguage(data.language)
                .setPublisher(data.publisher)
                .setSpecialEdition(data.specialedition)
                .setPackaging(data.packaging)
                .build())
            .setId(data.id)
            .build();
    }

    reverseMap(data: IdentifiableBook): SQLiteBook {
        return {
            id: data.getId(),
            booktitle: data.getBookTitle(),
            author: data.getAuthor(),
            genre: data.getGenre(),
            format: data.getFormat(),
            language: data.getLanguage(),
            publisher: data.getPublisher(),
            specialedition: data.getSpecialEdition(),
            packaging: data.getPackaging()
        };
    }
}