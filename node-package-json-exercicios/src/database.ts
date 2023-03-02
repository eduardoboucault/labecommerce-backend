//* Importar os types de types para serem usados;

import { user, product, purchase } from "./types/types"

//* Guardar os types como tipos de variáveis e aplicando o tipo certo;

export const users: user[] = [
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

export const products: product[] = [
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

export const purchases : purchase[] = [
    {
        userId:'dudu',
        productId:'AAA',
        quantity:2,
        totalPrice: 60
    },
    {
        userId:'dudu',
        productId:'AAB',
        quantity:1,
        totalPrice: 25
    }
];