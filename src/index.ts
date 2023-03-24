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

app.get('/users', (req: Request, res: Response) => {

    try {
        res.status(200).send(users);
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

});

app.get('/products', (req: Request, res: Response) => {

    try {
        res.status(200).send(products);
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }

    }

});

app.get('/products/search', (req: Request, res: Response) => {

    try {

        const q = req.query.q

        if (q !== undefined && typeof q === 'string') {
            if (q.length > 0) {
                const result = products.filter(product => product.name.toLowerCase().includes(q.toLowerCase()));
                res.status(200).send(result);
            } else {
                throw new Error('Parâmetro de busca vazio, insira algum valor.')
            }
        }

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            console.log(error.message)
        } else {
            console.log("Erro inesperado")
        }

    }

});

app.post('/users', (req: Request, res: Response) => {

    try {

        const { id, email, password }: user = req.body;

        if (id !== undefined) {
            if (typeof id !== 'string') {
                throw new Error('ID deve ser uma string.')
            }
        }

        const validateId = users.find(user => user.id === id)

        if (validateId) {
            throw new Error('ID cadastrado já existe.')
        }

        if (email !== undefined) {
            if (typeof email !== 'string') {
                throw new Error('Email deve ser uma string.')
            }
        }

        const validateEmail = users.find(user => user.email === email)

        if (validateEmail) {
            throw new Error('Email cadastrado já existe.')
        }

        if (password !== undefined) {
            if (typeof password !== 'string') {
                throw new Error('Password deve ser uma string')
            }
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            throw new Error("Password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

        const newUser = {
            id,
            email,
            password
        };

        users.push(newUser);

        res.status(201).send('Produto cadastrado com sucesso');

    } catch (error) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            console.log(error.message)
        } else {
            console.log('Erro inesperado')
        }
    }

});

app.post('/products', (req: Request, res: Response) => {

    const { id, name, price, category }: product = req.body;

    if (id !== undefined) {
        if (typeof id !== 'string') {
            throw new Error('ID do produto precisa ser string.')
        } else {
            const result = products.find(prod => prod.id === id)
            if (result) {
                throw new Error('ID de produto já cadastrado')
            }
        }
    }

    if (name !== undefined) {
        if (typeof name !== 'string') {
            throw new Error('Nome do produto precisa ser string.')
        } else {
            const result = products.find(prod => prod.name === name)
            if (result) {
                throw new Error('Nome de produto já cadastrado')
            }
        }
    }

    if (price !== undefined) {
        if (typeof price !== 'number') {
            throw new Error('Preço deve ser do tipo number')
        }
    }

    if (category !== undefined) {
        throw new Error('Defina uma categoria')
    }

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

    if (userId !== undefined) {
        if (typeof userId !== 'string') {
            throw new Error('ID de usuário precisa ser string')
        }
    }

    if (productId !== undefined) {
        if (typeof productId !== 'string') {
            throw new Error('ID do produto precisa ser uma string')
        }
    }

    if (quantity !== undefined) {
        if (typeof quantity !== 'number') {
            throw new Error('Quantidade precisa ser number')
        }
    }

    if (totalPrice !== undefined) {
        if (typeof totalPrice !== 'number') {
            throw new Error('Preço total precisa ser number')
        }
    }

    const existingPurchase = purchases.find(purchase => purchase.userId === userId && purchase.productId === productId);

    if (existingPurchase) {
        const purchasesWithTotalPrice = purchases.map(purchase => {
            const product = products.find(product => product.id === purchase.productId);
            return {
                ...purchase,
                totalPrice: product ? product.price * purchase.quantity : 0
            };
        });

        const existingTotalPrice = purchasesWithTotalPrice.find(purchase => purchase.userId === userId && purchase.productId === productId)?.totalPrice;

        if (existingTotalPrice !== totalPrice) {
            throw new Error('Preço total não corresponde ao preço calculado para esta compra');
        }
    }

    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    };

    purchases.push(newPurchase);

    res.status(201).send('Compra realizada com sucesso');
});

app.get('/products/:id', (req: Request, res: Response) => {

    const id = req.params.id;

    if (id !== undefined) {
        if (typeof id !== 'string') {
            throw new Error('ID inválido')
        }
    };

    const result = products.filter(prod => prod.id === id);

    if (result.length === 0) {
        throw new Error('Produto não existe');
    }

    res.status(200).send(result);

});

app.get('/users/:id/purchases', (req: Request, res: Response) => {

    const id = req.params.id;

    if (id !== undefined) {
        if (typeof id !== 'string') {
            throw new Error('ID inválido')
        }
    };

    const result = products.filter(prod => prod.id === id);

    if (result.length === 0) {
        throw new Error('Produto não existe');
    }

    res.status(200).send(result);
});

app.get('/products/:id', (req: Request, res: Response) => {

    const id = req.params.id;

    if (id !== undefined) {
        if (typeof id !== 'string') {
            throw new Error('ID inválido')
        }
    };

    const result = products.filter(prod => prod.id === id);

    if (result.length === 0) {
        throw new Error('Produto não existe');
    }

    res.status(200).send(result);
});

app.delete('/users/:id', (req: Request, res: Response) => {

    const id = req.params.id;

    if (id !== undefined) {
        if (typeof id !== 'string') {
            throw new Error('ID inválido')
        }
    };

    const indexUser = users.findIndex(user => user.id === id);

    if (indexUser === -1) {
        throw new Error('Usuário não encontrado')
    };

    users.splice(indexUser, 1);
    res.status(200).send('Usuário removido com sucesso!');
});

app.delete('/products/:id', (req: Request, res: Response) => {

    const id = req.params.id;

    if (id !== undefined) {
        if (typeof id !== 'string') {
            throw new Error('ID inválido')
        }
    };

    const indexProd = products.findIndex(prod => prod.id === id);

    if (indexProd === -1) {
        throw new Error('Usuário não encontrado')
    };

    products.slice(indexProd, 1);
    res.status(200).send('Produto removido com sucesso!');
});

app.put('/users/:id', (req: Request, res: Response) => {

    const id = req.params.id;

    if (typeof id !== 'string') {
        return res.status(400).send('ID de usuário inválido');
    }

    const { id: newId, email: newEmail, password: newPassword } = req.body;
    const errors = [];

    if (!newId) {
        errors.push('ID inexistente, digite um novo ID');
    }

    if (newId && typeof newId !== 'string') {
        errors.push('Novo id precisa ser string');
    }

    if (!newEmail) {
        errors.push('Novo email inexistente, digite um novo email');
    }

    if (newEmail && typeof newEmail !== 'string') {
        errors.push('Novo email precisa ser string');
    }

    if (!newPassword) {
        errors.push('Novo password inexistente, digite um novo password');
    }

    if (newPassword && typeof newPassword !== 'string') {
        errors.push('Novo password precisa ser string');
    }

    if (errors.length > 0) {
        return res.status(400).send(errors.join('. '));
    }

    const result = users.find(user => user.id === id);

    if (result) {
        Object.assign(result, { id: newId, email: newEmail, password: newPassword });
        res.status(200).send('Usuário editado com sucesso');
    } else {
        res.status(404).send('Usuário não encontrado');
    }
});

app.put('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== 'string') {
        return res.status(400).send('ID de usuário inválido');
    }

    const { id: newId, name: newName, price: newPrice, category: newCategory } = req.body;
    const errors = [];

    if (!newId) {
        errors.push('ID inexistente, digite um novo ID');
    }

    if (newId && typeof newId !== 'string') {
        errors.push('Novo id precisa ser string');
    }

    if (!newName) {
        errors.push('Novo nome inexistente, digite um novo nome');
    }

    if (newName && typeof newName !== 'string') {
        errors.push('Novo nome precisa ser string');
    }

    if (!newPrice) {
        errors.push('Novo preço inexistente, digite um novo preço');
    }

    if (newPrice && typeof newPrice !== 'number') {
        errors.push('Novo preço precisa ser um number');
    }

    if (!newCategory) {
        errors.push('Nova categoria inexistente, digite uma nova categoria');
    }

    if (newCategory && typeof newCategory !== 'string') {
        errors.push('Nova categoria precisa ser string');
    }

    if (errors.length > 0) {
        return res.status(400).send(errors.join('. '));
    }

    const result = users.find(user => user.id === id);

    if (result) {
        Object.assign(result, { id: newId, name: newName, price: newPrice, category: newCategory });
        res.status(200).send('Produto editado com sucesso');
    } else {
        res.status(404).send('Produto não encontrado');
    }
});