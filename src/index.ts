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

//* GET
app.get('/users', (req: Request, res: Response) => {
    res.status(200).send(users)
});

//* GET
app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(products);
});

//* GET
app.get('/products/search', (req: Request, res: Response) => {
    const q = req.query.q as string;
    const result = products.filter(product => product.name.toLowerCase().includes(q.toLowerCase()))
    res.status(200).send(result);
});

//? POST
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

//? POST
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

//? POST
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

//* GET
app.get('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const result = products.find(product => product.id === id);
    res.status(200).send(result);
});

//* GET
app.get('/users/:id/purchases', (req: Request, res: Response) => {
    const id = req.params.id;
    const result = purchases.filter(purchase => purchase.userId === id);
    res.status(200).send(result);
});

//*! DELETE
app.delete('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const indexUser = users.findIndex(user => user.id === id);
    if (indexUser >= 0) {
        users.splice(indexUser, 1)
        return res.status(200).send('User apagado com sucesso')
    }
});

//*! DELETE
app.delete('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const indexProduct = products.findIndex(product => product.id === id);
    if (indexProduct >= 0) {
        products.slice(indexProduct, 1)
        return res.status(200).send('Produto apagado com sucesso')
    };
});

//? PUT
app.put('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const newId = req.body.id as string | undefined;
    const newEmail = req.body.email as string | undefined;
    const newPassword = req.body.password as string | undefined;

    const validId = users.find(user => user.id === id);
    if (validId) {
        validId.id = newId || validId.id;
        validId.email = newEmail || validId.email
        validId.password = newPassword || validId.password
        return res.status(200).send('Cadastro atualizado com sucesso');
    };
    return res.send('User não encontrado')
});

//? PUT
app.put('/products/:id', (req: Request, res: Response) => {

    const id = req.params.id;
    
    const newId = req.body.id as string | undefined;
    const newName = req.body.name as string | undefined;
    const newPrice = req.body.price as number | undefined;
    const newCategory = req.body.category as CATEGORY | undefined;

    const validId = products.find(product => product.id === id);

    if(validId){
        validId.id = newId || validId.id;
        validId.name = newName || validId.name;
        validId.price = isNaN(newPrice) ? validId.price : newPrice;
        validId.category = newCategory || validId.category;
        return res.status(200).send('Produto atualizado com sucesso');
    };

    return res.send('Produto não encontrado');
});