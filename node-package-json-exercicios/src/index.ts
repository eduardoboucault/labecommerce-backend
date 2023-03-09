import { createUser, getAllUsers, createProduct, getAllProducts, createPurchase, getProductById, queryProductsByName, getAllPurchasesFromUserId } from "./database"
import { CATEGORY } from "./types/types";

// createUser('gilda', 'gilda@email.com', 'gilda123');
// getAllUsers();
// createProduct("004", "Monitor HD", 800, CATEGORY.ELECTRONICS);
// getAllProducts();
// createPurchase("004", "006", 2, 1600);
// getProductById("001");
// queryProductsByName('Moletom')
console.log(getAllPurchasesFromUserId('001'));