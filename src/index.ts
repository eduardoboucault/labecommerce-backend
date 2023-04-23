import {
  createUser,
  getAllUsers,
  createProduct,
  getAllProducts,
  createPurchase,
  getProductById,
  queryProductsByName,
  getAllPurchasesFromUserId,
  users,
  products,
  purchases,
} from "./database";
import { CATEGORY, product, purchase, user } from "./types/types";

//* Além de importar o express, também precisamos importar os objetos Request e Response, sempre entre chaves {} 👇🏽

import express, { Request, Response } from "express";

//* Import do CORS 👇🏽;

import cors from "cors";

//* Criação do servidor express 👇🏽;
const app = express();

//* Configuração do middleware que garante que nossas respostas estejam sempre no formato json 👇🏽;
app.use(express.json());

//* Configuração do middleware que habilita o CORS 👇🏽
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.post("/users", (req: Request, res: Response) => {
  try {
    const { id, email, password }: user = req.body;

    if (!id) {
      res.status(404)
      throw new Error("Campo ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      res.status(404)
      throw new Error("Digite ID em formato string.");
    }

    const validateId = users.find((user) => user.id === id);

    if (validateId) {
      res.status(409)
      throw new Error("ID cadastrado já existente.");
    }

    if (!email) {
      res.status(404)
      throw new Error("Campo email vazio, digite um email.");
    }

    if (typeof email !== "string") {
      res.status(404)
      throw new Error("Digite email em formato string.");
    }

    const validateEmail = users.find((user) => user.email === email);

    if (validateEmail) {
      res.status(409)
      throw new Error("Email cadastrado já existente.");
    }

    if (!password) {
      res.status(404)
      throw new Error("Campo password vazio, digite um password.");
    }

    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g
      )
    ) {
      res.status(404)
      throw new Error(
        "Password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial"
      );
    }

    if (!validateId && !validateEmail) {
      const newUser = {
        id,
        email,
        password,
      };
      users.push(newUser);
      res.status(201).send("Produto cadastrado com sucesso");
    }
  } catch (error) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("Erro inesperado");
    }
  }
});

app.post("/products", (req: Request, res: Response) => {
  const { id, name, price, category }: product = req.body;

  if (!id) {
    throw new Error("Campo ID vazio, digite um ID.");
  }

  if (typeof id !== "string") {
    throw new Error("Digite ID em formato string.");
  }

  const validateId = products.find((prod) => prod.id === id);

  if (validateId) {
    throw new Error(
      "ID de novo produto cadastrado já existente, por favor digite outro ID."
    );
  }

  if (!name) {
    throw new Error("Campo name vazio, digite um name.");
  }

  if (typeof name !== "string") {
    throw new Error("Digite name em formato string.");
  }

  const validateName = products.find((prod) => prod.name === name);

  if (validateName) {
    throw new Error("Nome de produto cadastrado já existente.");
  }

  if (!price) {
    throw new Error("Campo preço vazio, digite um preço.");
  }

  if (typeof price !== "number") {
    throw new Error("Preço precisar ser em formato number.");
  }

  if (!category) {
    throw new Error("Defina uma categoria");
  }

  if (!validateId && !validateName) {
    const newProduct = {
      id,
      name,
      price,
      category,
    };
    products.push(newProduct);
    res.status(201).send("Produto cadastrado com sucesso");
  }
});

app.post("/purchases", (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity, totalPrice }: purchase = req.body;

    if (!userId) {
      throw new Error("Campo ID vazio, digite um ID.");
    }

    if (typeof userId !== "string") {
      throw new Error("Digite ID em formato string.");
    }

    if (!productId) {
      throw new Error("Campo productID vazio, digite um ID.");
    }

    if (typeof productId !== "string") {
      throw new Error("Digite product ID em formato string.");
    }

    if (!quantity) {
      throw new Error("Campo quantity vazio, digite um ID.");
    }

    if (typeof quantity !== "number") {
      throw new Error("Digite quantity em formato number.");
    }

    if (!totalPrice) {
      throw new Error("Campo totalPrice vazio, digite um ID.");
    }

    if (typeof totalPrice !== "number") {
      throw new Error("Digite totalPrice em formato number.");
    }

    const existingPurchase = purchases.find(
      (purchase) =>
        purchase.userId === userId && purchase.productId === productId
    );

    if (existingPurchase) {
      const purchasesWithTotalPrice = purchases.map((purchase) => {
        const product = products.find(
          (product) => product.id === purchase.productId
        );
        return {
          ...purchase,
          totalPrice: product ? product.price * purchase.quantity : 0,
        };
      });

      const existingTotalPrice = purchasesWithTotalPrice.find(
        (purchase) =>
          purchase.userId === userId && purchase.productId === productId
      )?.totalPrice;

      if (existingTotalPrice !== totalPrice) {
        res.status(409)
        throw new Error(
          "Preço total não corresponde ao preço calculado para esta compra"
        );
      }
    }

    if (!existingPurchase) {
      const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice,
      };
      purchases.push(newPurchase);
      res.status(201).send("Compra realizada com sucesso");
    }
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

app.get("/users", (req: Request, res: Response) => {
  try {
    res.status(200).send(users);
  } catch (error) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/products", (req: Request, res: Response) => {
  try {
    res.status(200).send(products);
  } catch (error) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/products/search", (req: Request, res: Response) => {
  try {
    const q = req.query.q;

    if (!q) {
      throw new Error("Ditige um parâmetro de busca.");
    }

    if (typeof q !== "string") {
      throw new Error("Digite um parâmetro de busca no formato string.");
    }

    const result = products.filter((product) =>
      product.name.toLowerCase().includes(q.toLowerCase())
    );

    if (!result) {
      throw new Error("Busca não encontrada.");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("Erro inesperado");
    }
  }
});

app.get("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error("Campo ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      throw new Error("Digite ID em formato string.");
    }

    const result = products.find((prod) => prod.id === id);

    if (!result) {
      throw new Error("Produto não encontrado.");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

app.get("/users/:id/purchases", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error("Campo ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      throw new Error("Digite ID em formato string.");
    }

    const result = products.find((prod) => prod.id === id);

    if (!result) {
      throw new Error("Produto não existe");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

app.get("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error("Campo de ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      throw new Error("ID precisa estar no formato string.");
    }

    const result = products.find((prod) => prod.id === id);

    if (!result) {
      throw new Error("Produto não existe");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).send("ID de usuário inválido");
  }

  const { id: newId, email: newEmail, password: newPassword } = req.body;
  const errors = [];

  if (!newId) {
    errors.push("ID inexistente, digite um novo ID");
  }

  if (newId && typeof newId !== "string") {
    errors.push("Novo id precisa ser string");
  }

  if (!newEmail) {
    errors.push("Novo email inexistente, digite um novo email");
  }

  if (newEmail && typeof newEmail !== "string") {
    errors.push("Novo email precisa ser string");
  }

  if (!newPassword) {
    errors.push("Novo password inexistente, digite um novo password");
  }

  if (newPassword && typeof newPassword !== "string") {
    errors.push("Novo password precisa ser string");
  }

  if (errors.length > 0) {
    return res.status(400).send(errors.join(". "));
  }

  const result = users.find((user) => user.id === id);

  if (result) {
    Object.assign(result, {
      id: newId,
      email: newEmail,
      password: newPassword,
    });
    res.status(200).send("Usuário editado com sucesso");
  } else {
    res.status(404).send("Usuário não encontrado");
  }
});

app.put("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).send("ID de usuário inválido");
  }

  const {
    id: newId,
    name: newName,
    price: newPrice,
    category: newCategory,
  } = req.body;
  const errors = [];

  if (!newId) {
    errors.push("ID inexistente, digite um novo ID");
  }

  if (newId && typeof newId !== "string") {
    errors.push("Novo id precisa ser string");
  }

  if (!newName) {
    errors.push("Novo nome inexistente, digite um novo nome");
  }

  if (newName && typeof newName !== "string") {
    errors.push("Novo nome precisa ser string");
  }

  if (!newPrice) {
    errors.push("Novo preço inexistente, digite um novo preço");
  }

  if (newPrice && typeof newPrice !== "number") {
    errors.push("Novo preço precisa ser um number");
  }

  if (!newCategory) {
    errors.push("Nova categoria inexistente, digite uma nova categoria");
  }

  if (newCategory && typeof newCategory !== "string") {
    errors.push("Nova categoria precisa ser string");
  }

  if (errors.length > 0) {
    return res.status(400).send(errors.join(". "));
  }

  const result = users.find((user) => user.id === id);

  if (result) {
    Object.assign(result, {
      id: newId,
      name: newName,
      price: newPrice,
      category: newCategory,
    });
    res.status(200).send("Produto editado com sucesso");
  } else {
    res.status(404).send("Produto não encontrado");
  }
});

app.delete("/users/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error("ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      throw new Error("ID precisa estar no formato string.");
    }

    const indexUser = users.findIndex((user) => user.id === id);

    if (indexUser === -1) {
      throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    users.splice(indexUser, 1);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

app.delete("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error("ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      throw new Error("ID precisa estar no formato string.");
    }

    const indexUser = products.findIndex((prod) => prod.id === id);

    if (indexUser === -1) {
      throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    users.splice(indexUser, 1);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});
