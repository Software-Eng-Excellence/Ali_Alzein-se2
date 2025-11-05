import { id } from "repository/IRepository";
import { IIdentifiableItem, IItem, itemCategory } from "./IItem";

export class Book implements IItem {
    getCategory(): itemCategory {
        return itemCategory.BOOK;
    }

    private bookTitle: string;
    private author: string;
    private genre: string;
    private format: string;
    private language: string;
    private publisher: string;
    private specialEdition: string;
    private packaging: string;

    constructor(
        bookTitle: string,
        author: string,
        genre: string,
        format: string,
        language: string,
        publisher: string,
        specialEdition: string,
        packaging: string
    ) {
        this.bookTitle = bookTitle;
        this.author = author;
        this.genre = genre;
        this.format = format;
        this.language = language;
        this.publisher = publisher;
        this.specialEdition = specialEdition;
        this.packaging = packaging;
    }

    getBookTitle(): string {
        return this.bookTitle;
    }

    getAuthor(): string {
        return this.author;
    }

    getGenre(): string {
        return this.genre;
    }

    getFormat(): string {
        return this.format;
    }

    getLanguage(): string {
        return this.language;
    }

    getPublisher(): string {
        return this.publisher;
    }

    getSpecialEdition(): string {
        return this.specialEdition;
    }

    getPackaging(): string {
        return this.packaging;
    }

}

export class IdentifiableBook extends Book implements IIdentifiableItem{
    constructor(private id:id,
        bookTitle: string,
        author: string,
        genre: string,
        format: string,
        language: string,
        publisher: string,
        specialEdition: string,
        packaging: string)
        
        {
            super(
                bookTitle,
                author,
                genre,
                format,
                language,
                publisher,
                specialEdition,
                packaging
            )
        }
    getId(): id {
        return this.id;
    }
    
}