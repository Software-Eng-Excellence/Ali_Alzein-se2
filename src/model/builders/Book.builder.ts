import { Book } from "../Book.model";
import logger from "../../util/logger";

export class BookBuilder {
    private bookTitle!: string;
    private author!: string;
    private genre!: string;
    private format!: string;
    private language!: string;
    private publisher!: string;
    private specialEdition!: string;
    private packaging!: string;

    public static newbuilder(): BookBuilder{
        return new BookBuilder();
    }

    public setBookTitle(bookTitle: string): BookBuilder {
        this.bookTitle = bookTitle;
        return this;
    }

    public setAuthor(author: string): BookBuilder {
        this.author = author;
        return this;
    }

    public setGenre(genre: string): BookBuilder {
        this.genre = genre;
        return this;
    }

    public setFormat(format: string): BookBuilder {
        this.format = format;
        return this;
    }

    public setLanguage(language: string): BookBuilder {
        this.language = language;
        return this;
    }

    public setPublisher(publisher: string): BookBuilder {
        this.publisher = publisher;
        return this;
    }

    public setSpecialEdition(specialEdition: string): BookBuilder {
        this.specialEdition = specialEdition;
        return this;
    }

    public setPackaging(packaging: string): BookBuilder {
        this.packaging = packaging;
        return this;
    }

    build(): Book {
        const requiredProperties= [
            this.bookTitle,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging
        ]
        for (const prop of requiredProperties) {
            if (!prop) {
                logger.error("Missing required property for Book, cannot build Book instance");
                throw new Error("Missing required property for Book");
            }        
        }
        return new Book(
            this.bookTitle,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging
        );
    }
}