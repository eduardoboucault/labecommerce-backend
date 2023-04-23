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

import { db } from "./database";

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

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, email, password }: user = req.body;

    if (!id || !email || !password) {
      return res.status(404).send("Todos os campos devem ser preenchidos.");
    }

    if (
      typeof id !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res
        .status(404)
        .send(
          "Todos os campos devem ser preenchidos com valores do tipo string."
        );
    }

    const existingUser = await db("users")
      .select()
      .where({ id })
      .orWhere({ email });

    if (existingUser.length) {
      return res.status(409).send("ID ou email já cadastrado.");
    }

    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/
      )
    ) {
      return res
        .status(404)
        .send(
          "Password deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial."
        );
    }

    await db("users").insert({ id, email, password });

    return res.status(201).send("Usuário cadastrado com sucesso!");
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

app.post("/products", async (req: Request, res: Response) => {
  const { id, name, price, category }: product = req.body;

  try {
    if (!id || typeof id !== "string") {
      res.status(404);
      throw new Error("Digite um ID válido em formato string.");
    }

    const validateId = await db("products").where({ id }).first();

    if (validateId) {
      res.status(409);
      throw new Error(
        "ID de novo produto já existente, por favor digite outro ID."
      );
    }

    if (!name || typeof name !== "string") {
      res.status(404);
      throw new Error("Digite um name válido em formato string.");
    }

    const validateName = await db("products").where({ name }).first();

    if (validateName) {
      res.status(409);
      throw new Error("Nome de produto já existente.");
    }

    if (!price || typeof price !== "number") {
      res.status(404);
      throw new Error("Digite um preço válido em formato number.");
    }

    if (!category) {
      res.status(404);
      throw new Error("Defina uma categoria");
    }

    const newProduct = {
      id,
      name,
      price,
      category,
    };

    await db("products").insert(newProduct);

    res.status(201).send("Produto cadastrado com sucesso");
  } catch (error) {
    console.log(error);

    if (res.statusCode === 201) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity, totalPrice }: purchase = req.body;

    if (
      !userId ||
      typeof userId !== "string" ||
      !productId ||
      typeof productId !== "string" ||
      !quantity ||
      typeof quantity !== "number" ||
      !totalPrice ||
      typeof totalPrice !== "number"
    ) {
      res.status(404);
      throw new Error("Algum dos campos está vazio ou no formato errado.");
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
        res.status(409);
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

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`
	        SELECT * FROM users;
        `);

    res.status(200).send(result);
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

app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`
    SELECT * FROM products;
  `);

    res.status(200).send(result);
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

app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q;

    if (!q) {
      res.status(400);
      throw new Error("Por favor insira um parâmetro de busca.");
    }

    const products = await db("products")
      .select("*")
      .whereRaw("LOWER(name) LIKE '%' || LOWER(?) || '%'", [q]);

    if (!products.length) {
      res.status(404);
      throw new Error("Nenhum produto encontrado.");
    } else {
      res.status(200).send(products);
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

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(404);
      throw new Error("Campo ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      res.status(404);
      throw new Error("Digite ID em formato string.");
    }

    const result = await db("products").where({ id }).first();

    if (!result) {
      res.status(404);
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

app.get("/users/:id/purchases", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(404);
      throw new Error("Campo ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      res.status(404);
      throw new Error("Digite ID em formato string.");
    }

    const result = products.find((prod) => prod.id === id);

    if (!result) {
      res.status(404);
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

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(404);
      throw new Error("Campo de ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      throw new Error("ID precisa estar no formato string.");
    }

    const result = products.find((prod) => prod.id === id);

    if (!result) {
      res.status(404);
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

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
      throw new Error("ID de usuário inválido");
    }

    const { id: newId, email: newEmail, password: newPassword } = req.body;

    if (!newId || typeof newId !== "string") {
      throw new Error("Novo id precisa ser string");
    }

    if (!newEmail || typeof newEmail !== "string") {
      throw new Error("Novo email precisa ser string");
    }

    if (!newPassword || typeof newPassword !== "string") {
      throw new Error("Novo password precisa ser string");
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

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
      throw new Error("ID de produto inválido");
    }

    const {
      id: newId,
      name: newName,
      price: newPrice,
      category: newCategory,
    } = req.body;

    if (!newId || typeof newId !== "string") {
      throw new Error("Novo id precisa ser string");
    }

    if (!newName || typeof newName !== "string") {
      throw new Error("Novo nome precisa ser string");
    }

    if (!newPrice || typeof newPrice !== "number") {
      throw new Error("Novo preço precisa ser um number");
    }

    if (!newCategory || typeof newCategory !== "string") {
      throw new Error("Nova categoria precisa ser string");
    }

    const result = products.find((prod) => prod.id === id);

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

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(404);
      throw new Error("ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      res.status(404);
      throw new Error("ID precisa estar no formato string.");
    }

    const indexUser = users.findIndex((user) => user.id === id);

    if (indexUser === -1) {
      res.status(404);
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

app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(404);
      throw new Error("ID vazio, digite um ID.");
    }

    if (typeof id !== "string") {
      res.status(404);
      throw new Error("ID precisa estar no formato string.");
    }

    const indexUser = products.findIndex((prod) => prod.id === id);

    if (indexUser === -1) {
      res.status(404);
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
