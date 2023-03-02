//* Criar variáveis exportáveis em type para tipificar o que será usado no app;

export type user = {
    id:string,
    email:string,
    password:string
};

export type product = {
    id:string,
    name:string,
    price:number,
    category:string
};

export type purchase = {
    userId:string,
    productId:string,
    quantity:number,
    totalPrice:number
};