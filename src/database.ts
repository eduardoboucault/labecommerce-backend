//* Importar os types de types para serem usados;

import { user, product, purchase, CATEGORY } from "./types/types";

//* Guardar os types como tipos de variáveis e aplicando o tipo certo;

export const users: user[] = [
    {
        id: 'u001',
        email: 'eduardo@email.com',
        password: 'eduardo123'

    },
    {
        id: 'u002',
        email: 'natalia@email.com',
        password: 'natalia123'

    },
    {
        id: 'u003',
        email: 'lucas@email.com',
        password: 'lucas123'
    }
];

export const products: product[] = [
    {
        id: 'p001',
        name: 'Relógio',
        price: 30,
        category: CATEGORY.ACCESSORIES
    },
    {
        id: 'p002',
        name: 'Moletom',
        price: 70,
        category: CATEGORY.CLOTHES_AND_SHOES
    },
    {
        id: 'p003',
        name: 'Celular',
        price: 800,
        category: CATEGORY.ELECTRONICS
    }
];

export const purchases: purchase[] = [
    {
        userId: 'b001',
        productId: '001',
        quantity: 2,
        totalPrice: 60
    },
    {
        userId: 'b002',
        productId: '002',
        quantity: 1,
        totalPrice: 140
    },
    {
        userId: 'b003',
        productId: '003',
        quantity: 1,
        totalPrice: 800
    }
];

export function createUser(id: string, email: string, password: string): void {
    const newUser = {
        id,
        email,
        password
    }
    users.push(newUser);
    console.log('Cadastro realizado com sucesso!');
};

export function getAllUsers() {
    console.table(users);
};

export function createProduct(id: string, name: string, price: number, category: any): void {
    const newProduct = {
        id,
        name,
        price,
        category
    };
    products.push(newProduct);
    console.log('Produto cadastrado com sucesso!');
};

export function getAllProducts() {
    console.table(products);
};

export function queryProductsByName(q: string) {
    const filteredProducts = products.filter((prod: product) => {
        return prod.name.toLowerCase().includes(q.toLowerCase());
    });
    console.log(filteredProducts);
    return filteredProducts;
};

export function getProductById(id: string) {
    products.find((prod: product) => {
        prod.id == id
        if (prod.id == id) {
            console.log(prod)
        }
    })
};

export function createPurchase(userId: string, productId: string, quantity: number, totalPrice: number): void {
    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    }
    purchases.push(newPurchase);
    console.log('Compra realizada!');
};

export function getAllPurchasesFromUserId(userIdToSearch: string): purchase[] {
    return purchases.filter((purchase) => purchase.userId === userIdToSearch)
};
