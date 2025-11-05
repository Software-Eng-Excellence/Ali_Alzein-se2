import { Book, IdentifiableBook } from "../Book.model";
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
export class IdentifiableBookBuilder{
    private id!: string;
    private book!:Book;

    static newBuilder(): IdentifiableBookBuilder{
        return new IdentifiableBookBuilder();
    }

    setId(id:string): IdentifiableBookBuilder{
        this.id=id;
        return this;
    }
    setBook(book:Book):IdentifiableBookBuilder{
        this.book=book;
        return this;
    }
    build(): IdentifiableBook{
        if (!this.id || !this.book) {
            logger.error("Missing required property for IdentifiableBook, cannot build IdentifiableBook instance");
            throw new Error("Missing required property for IdentifiableBook");
        }

        return new IdentifiableBook(
            this.id,
            this.book.getBookTitle(),
            this.book.getAuthor(),
            this.book.getGenre(),
            this.book.getFormat(),
            this.book.getLanguage(),
            this.book.getPublisher(),
            this.book.getSpecialEdition(),
            this.book.getPackaging()
        );
    }
}