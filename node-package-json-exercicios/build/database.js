"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchases = exports.products = exports.users = void 0;
exports.users = [
    {
        id: 'dudu',
        email: 'dudu@email.com',
        password: 'dudu123'
    },
    {
        id: 'dudu2',
        email: 'dudu2@email.com',
        password: 'dudu1234'
    }
];
exports.products = [
    {
        id: 'AAA',
        name: 'Panela de pressão',
        price: 30,
        category: 'Utensílios'
    },
    {
        id: 'AAB',
        name: 'Frigideira',
        price: 25,
        category: 'Utensílios'
    }
];
exports.purchases = [
    {
        userId: 'dudu',
        productId: 'AAA',
        quantity: 2,
        totalPrice: 60
    },
    {
        userId: 'dudu',
        productId: 'AAB',
        quantity: 1,
        totalPrice: 25
    }
];
//# sourceMappingURL=database.js.map