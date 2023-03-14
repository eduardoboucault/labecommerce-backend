import { createUser, getAllUsers, createProduct, getAllProducts, createPurchase, getProductById, queryProductsByName, getAllPurchasesFromUserId, users, products, purchases } from "./database"
import { CATEGORY, product, purchase, user } from "./types/types";

//* Além de importar o express, também precisamos importar os objetos Request e Response, sempre entre chaves {} 👇🏽

import express, { Request, Response } from 'express';

//* Import do CORS 👇🏽;

import cors from 'cors';

//* Criação do servidor express 👇🏽;
const app = express();

//* Configuração do middleware que garante que nossas respostas estejam sempre no formato json 👇🏽;
app.use(express.json());

//* Configuração do middleware que habilita o CORS 👇🏽
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('pong!')
});

app.get('/users', (req: Request, res: Response) => {
    res.status(200).send(users)
});

app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(products);
});

app.get('/products/search', (req: Request, res: Response) => {
    const q = req.query.q as string;
    const result = products.filter(product => product.name.toLowerCase().includes(q.toLowerCase()))
    res.status(200).send(result);
});

app.post('/users', (req: Request, res: Response) => {
    const { id, email, password }: user = req.body;
    const newUser = {
        id,
        email,
        password
    }
    users.push(newUser);
    res.status(201).send('Produto cadastrado com sucesso');
});

app.post('/products', (req: Request, res: Response) => {
    const { id, name, price, category }: product = req.body;
    const newProduct = {
        id,
        name,
        price,
        category
    };
    products.push(newProduct);
    res.status(201).send('Produto cadastrado com sucesso');
});

app.post('/purchases', (req: Request, res: Response) => {
    const { userId, productId, quantity, totalPrice }: purchase = req.body;
    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    };
    purchases.push(newPurchase);
    res.status(201).send('Compra realizada com sucesso')
});
