import { Item, itemCategory } from "./Item.model";
type Genre = "Fiction" | "Non-Fiction" | "Science Fiction" | "Fantasy" | "Biography" | "History" | "Children" | "Other";
type language = "English" | "Spanish" | "French" | "German" | "Arabic" | "Other";
export class Book implements Item {
    getCategory(): itemCategory {
        return itemCategory.BOOK;
    }

    private orderId: string;
    private bookTitle: string;
    private author: string;
    private genre: Genre;
    private format: string;
    private language: language;
    private publisher: string;
    private specialEdition: string;
    private packaging: string;
    private price: number;
    private quantity: number;

    constructor(
        orderId: string,
        bookTitle: string,
        author: string,
        genre: Genre,
        format: string,
        language: language,
        publisher: string,
        specialEdition: string,
        packaging: string,
        price: number,
        quantity: number
    ) {
        this.orderId = orderId;
        this.bookTitle = bookTitle;
        this.author = author;
        this.genre = genre;
        this.format = format;
        this.language = language;
        this.publisher = publisher;
        this.specialEdition = specialEdition;
        this.packaging = packaging;
        this.price = price;
        this.quantity = quantity;
    }

    getOrderId(): string {
        return this.orderId;
    }

    getBookTitle(): string {
        return this.bookTitle;
    }

    getAuthor(): string {
        return this.author;
    }

    getGenre(): Genre {
        return this.genre;
    }

    getFormat(): string {
        return this.format;
    }

    getLanguage(): language {
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

    getPrice(): number {
        return this.price;
    }

    getQuantity(): number {
        return this.quantity;
    }

}