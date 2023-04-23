-- Active: 1680008786217@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

INSERT INTO
    users (id, email, password)
VALUES (
        'u001',
        'eduardo@email.com.br',
        'edu123ardo'
    ), (
        'u002',
        'lucas@email.com.br',
        'lu123cas'
    ), (
        'u003',
        'natalia@email.com',
        'nat123alia'
    );

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL
    );

INSERT INTO
    products (id, name, price, category)
VALUES (
        'p001',
        'TECLADO',
        100.00,
        'INFORMÁTICA'
    ), (
        'p002',
        'CADEIRA DE ESCRITÓRIO',
        730.50,
        'MOBÍLIA'
    ), (
        'p003',
        'MONITOR LED HDMI',
        1200.00,
        'TELEVISORES'
    ), (
        'p004',
        'VENTILADOR',
        80.50,
        'ELETRODOMÉSTICO'
    ), (
        'p005',
        'MOUSE',
        90.99,
        'INFORMÁTICA'
    );

SELECT * FROM users;

SELECT * FROM products;

SELECT * FROM products WHERE name LIKE '%monitor%';

-- 2. crie um novo usuário

-- insere o item mockado na tabela users

INSERT INTO
    users (id, email, password)
VALUES (
        'u004',
        'novo@usuario.com',
        'senha123'
    );

-- 3. crie um novo produto

-- insere o item mockado na tabela products

INSERT INTO
    products (id, name, price, category)
VALUES (
        'p006',
        'SMARTPHONE',
        2000.00,
        'CELULARES'
    );

-- 4. busca de produtos por id

SELECT * FROM products WHERE id = 'p001';

-- 5. deleção de user por id

DELETE FROM users WHERE id = 'u001';

-- 6. deleção de produto por id

DELETE FROM products WHERE id = 'p005';

-- 7. edição de user por id

UPDATE users SET email = 'novoemail@usuario.com' WHERE id = 'u002';

-- 8. edição de produto por id

UPDATE products SET price = 1500.00 WHERE id = 'p003';

SELECT * FROM users ORDER BY email ASC;

SELECT * FROM products ORDER BY price ASC LIMIT 20 OFFSET 0;

SELECT *
FROM products
WHERE
    price BETWEEN 100.00 AND 300.00
ORDER BY price ASC;