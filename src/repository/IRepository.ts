export type id = string;
export interface ID{
    getId(): id;
}


export interface Initializable {
    /**
 * Establishes a connection to the underlying data store and creates any required tables or schemas.
 * @returns A promise that resolves when initialization has completed successfully.
 * @throws InitializationException If the initialization process fails.
 */
    init(): Promise<void>;
}

export interface IRepository<T extends ID> {
    /**
     * Creates a new item in the repository.
     * @template T - The type of the items managed by the repository, which extends ID.
     * @throws {InvalidItemException} - Thrown if the item is invalid.
     * @throws {DbException} - Thrown when an error when interaction with database.
     */
    create(item: T): Promise<string>;

    /**
     * Retrieves an item from the repository by its unique identifier.
     * @param id - The unique identifier of the item to retrieve.
     * @returns A promise that resolves to the item of type T.
     * @throws {ItemNotFoundException} - Thrown if the item with the specified ID does not exist.
     */
    get(id: string): Promise<T>;
    /**
     * Retrieves all items from the repository.
     * @returns A promise that resolves to an array of items of type T.
     */
    getAll(): Promise<T[]>;
    /**
     * Updates an existing item in the repository.
     * @param item - The item to update, which must extend ID.
     * @returns A promise that resolves when the update is complete.
     * @throws {InvalidItemException} - Thrown if the item is invalid.
     * @throws {ItemNotFoundException} - Thrown if the item does not exist in the repository.
     * @throws {DbException} - Thrown when an error when interaction with database.
     */
    update(item: T): Promise<void>;
    /**
     * 
     * @param id target id to be deleted
     * @returns a promise that resolves when the item is deleted
     * @throws {ItemNotFoundException} - Thrown if the item with the specified ID does not exist.
     * @throws {DbException} - Thrown when an error when interaction with database.
     */
    delete(id: id): Promise<void>;
}

export interface InitializableRepository<T extends ID> extends IRepository<T>, Initializable {}
