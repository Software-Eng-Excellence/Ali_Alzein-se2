import pool from "../repository/PostgreSQL/ConnectionManager";
import { CakeRepository } from "../repository/PostgreSQL/Cake.order.repository";
import { ToyRepository } from "../repository/PostgreSQL/Toy.order.repository";
import { BookRepository } from "../repository/PostgreSQL/Book.order.repository"
import { OrderRepository } from "../repository/PostgreSQL/Order.repository";

(async () => {
  try {
    // Initialize each item repository first
    const cakeRepo = new CakeRepository();
    const toyRepo = new ToyRepository();
    const bookRepo = new BookRepository();

    // Example: choose one to link with OrderRepository
    const orderRepo = new OrderRepository(cakeRepo);

    // Initialize all repositories
    console.log("🚀 Initializing PostgreSQL tables...");
    await cakeRepo.init();
    await toyRepo.init();
    await bookRepo.init();
    await orderRepo.init();

    console.log("✅ All tables initialized successfully!");
  } catch (err) {
    console.error("❌ Failed to initialize tables:", err);
  } finally {
    await pool.end();
  }
})();