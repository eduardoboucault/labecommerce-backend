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

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        total_price REAL NOT NULL,
        paid INTEGER NOT NULL,
        created_at TEXT,
        delivered_at TEXT,
        buyer_id TEXT NOT NULL,
        FOREIGN KEY (buyer_id) REFERENCES users (id)
    );

INSERT INTO
    purchases (id, total_price, paid, buyer_id)
VALUES ('p001', 100.00, 0, 'u001'), ('p002', 730.50, 0, 'u002'), ('p003', 1200.00, 0, 'u003');

INSERT INTO
    purchases (
        id,
        total_price,
        paid,
        created_at,
        buyer_id
    )
VALUES ('pu001', 250.00, 0, NULL, 'u001'), ('pu002', 500.00, 0, NULL, 'u001'), ('pu003', 175.00, 0, NULL, 'u002'), ('pu004', 275.00, 0, NULL, 'u002'), ('pu005', 800.00, 0, NULL, 'u003'), ('pu006', 150.00, 0, NULL, 'u003');

UPDATE purchases
SET
    delivered_at = DATETIME('now')
WHERE id = 'pu001';

SELECT
    p.id AS purchase_id,
    p.total_price,
    p.paid,
    p.created_at,
    p.delivered_at,
    pr.id AS product_id,
    pr.name AS product_name,
    pr.price AS product_price,
    pr.category AS product_category
FROM purchases p
    JOIN products pr ON p.id = pr.id
WHERE p.buyer_id = 'u001';