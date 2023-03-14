"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesFromUserId = exports.createPurchase = exports.getProductById = exports.queryProductsByName = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.purchases = exports.products = exports.users = void 0;
const types_1 = require("./types/types");
exports.users = [
    {
        id: 'eduardo',
        email: 'eduardo@email.com',
        password: 'eduardo123'
    },
    {
        id: 'natalia',
        email: 'natalia@email.com',
        password: 'natalia123'
    },
    {
        id: 'lucas',
        email: 'lucas@email.com',
        password: 'lucas123'
    }
];
exports.products = [
    {
        id: '001',
        name: 'Relógio',
        price: 30,
        category: types_1.CATEGORY.ACCESSORIES
    },
    {
        id: '002',
        name: 'Moletom',
        price: 70,
        category: types_1.CATEGORY.CLOTHES_AND_SHOES
    },
    {
        id: '003',
        name: 'Celular',
        price: 800,
        category: types_1.CATEGORY.ELECTRONICS
    }
];
exports.purchases = [
    {
        userId: '001',
        productId: '001',
        quantity: 2,
        totalPrice: 60
    },
    {
        userId: '002',
        productId: '002',
        quantity: 1,
        totalPrice: 140
    },
    {
        userId: '003',
        productId: '003',
        quantity: 1,
        totalPrice: 800
    }
];
function createUser(id, email, password) {
    const newUser = {
        id,
        email,
        password
    };
    exports.users.push(newUser);
    console.log('Cadastro realizado com sucesso!');
}
exports.createUser = createUser;
;
function getAllUsers() {
    console.table(exports.users);
}
exports.getAllUsers = getAllUsers;
;
function createProduct(id, name, price, category) {
    const newProduct = {
        id,
        name,
        price,
        category
    };
    exports.products.push(newProduct);
    console.log('Produto cadastrado com sucesso!');
}
exports.createProduct = createProduct;
;
function getAllProducts() {
    console.table(exports.products);
}
exports.getAllProducts = getAllProducts;
;
function queryProductsByName(q) {
    const filteredProducts = exports.products.filter((prod) => {
        return prod.name.toLowerCase().includes(q.toLowerCase());
    });
    console.log(filteredProducts);
    return filteredProducts;
}
exports.queryProductsByName = queryProductsByName;
;
function getProductById(id) {
    exports.products.find((prod) => {
        prod.id == id;
        if (prod.id == id) {
            console.log(prod);
        }
    });
}
exports.getProductById = getProductById;
;
function createPurchase(userId, productId, quantity, totalPrice) {
    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    };
    exports.purchases.push(newPurchase);
    console.log('Compra realizada!');
}
exports.createPurchase = createPurchase;
;
function getAllPurchasesFromUserId(userIdToSearch) {
    return exports.purchases.filter((purchase) => purchase.userId === userIdToSearch);
}
exports.getAllPurchasesFromUserId = getAllPurchasesFromUserId;
;
//# sourceMappingURL=database.js.map