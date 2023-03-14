import { createUser, getAllUsers, createProduct, getAllProducts, createPurchase, getProductById, queryProductsByName, getAllPurchasesFromUserId, users } from "./database"
import { CATEGORY } from "./types/types";

//* Além de importar o express, também precisamos importar os objetos Request e Response, sempre entre chaves {} 👇🏽

import express, { Request, Response } from 'express';

//* Import do CORS 👇🏽;

import cors from 'cors';

//* Criação do servidor express 👇🏽;
const app = express();

//* Configuração do middleware que garante que nossas respostas estejam sempre no formato json 👇🏽;
app.use(express.json());

//* Configuração do middleware que habilita o CORS 👇🏽
app.use(cors);

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('pong!')
});

app.get('/users', (req: Request, res: Response) => {
    res.status(200).send(users)
});