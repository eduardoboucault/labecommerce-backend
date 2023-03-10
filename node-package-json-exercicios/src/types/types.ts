//* Criar variáveis exportáveis em type para tipificar o que será usado no app;

export type user = {
    id: string,
    email: string,
    password: string
};

export enum CATEGORY {
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELECTRONICS = "Eletrônicos"
};

export type product = {
    id: string,
    name: string,
    price: number,
    category: CATEGORY
};

export type purchase = {
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number
};