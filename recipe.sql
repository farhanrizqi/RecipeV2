-- Active: 1689913329529@@147.139.210.135@5432@farhan01

--create table

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        pass VARCHAR NOT NULL,
        role VARCHAR NOT NULL
    );

CREATE TABLE
    category (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL
    );

CREATE TABLE
    recipe (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        ingredients VARCHAR(1000) NOT NULL,
        categoryId INTEGER NOT NULL,
        img VARCHAR NOT NULL,
        usersId INTEGER NOT NULL,
        createDate TIMESTAMP NOT NULL,
        updateDate TIMESTAMP DEFAULT NULL,
        CONSTRAINT FKcategory FOREIGN KEY(categoryId) REFERENCES category(id),
        CONSTRAINT users_recipe FOREIGN KEY(usersId) REFERENCES users(id)
    );

-- insertions start

-- category start

INSERT INTO category (name)
VALUES ('Appetizer'), ('Main Course'), ('Desert ');

-- category end

--users start

INSERT INTO
    users (name, email, pass, role)
VALUES (
        'John',
        'jhontor@gmail.com',
        '123',
        'admin'
    ), (
        'Lintang',
        'lantung@gmail.com',
        '123',
        'admin'
    ), (
        'Duka',
        'lara@gmail.com',
        '123',
        'admin'
    ), (
        'Hari',
        'hari@gmail.com',
        '123',
        'admin'
    ), (
        'Hari',
        'hari@gmail.com',
        '123',
        'users'
    );

--users end

--recipe start

INSERT INTO
    recipe (
        title,
        ingredients,
        category_id,
        img,
        users_id,
        created_at
    )
VALUES (
        'Vin Rouge',
        'Anggur',
        1,
        'https://placehold.co/600x400/png',
        2,
        NOW()
    ), (
        'Petit Canelle',
        'Gula jawa',
        3,
        'https://placehold.co/600x400/png',
        2,
        NOW()
    ), (
        'Ratatouille',
        'Sayuran',
        2,
        'https://placehold.co/600x400/png',
        2,
        NOW()
    );

--recipe end

-- read

SELECT * FROM users WHERE id = 2;

--read end

--alter

ALTER TABLE users ADD COLUMN photos VARCHAR ;

ALTER TABLE users ADD COLUMN updated_at TIMESTAMP;

ALTER TABLE recipe RENAME COLUMN categoryId to category_id;

ALTER TABLE recipe RENAME COLUMN updateDate to updated_at;

ALTER TABLE users RENAME COLUMN createDate to created_at;

ALTER TABLE recipe RENAME COLUMN usersId to users_id;

ALTER TABLE users ADD COLUMN createDate TIMESTAMP DEFAULT NOW();

ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER table recipe ALTER COLUMN createDate SET DEFAULT NOW() ;

ALTER TABLE recipe ALTER COLUMN title SET NOT NULL;

ALTER TABLE recipe ALTER COLUMN ingredients SET NOT NULL;

ALTER TABLE users ALTER COLUMN name SET NOT NULL;

ALTER TABLE users ALTER COLUMN email SET NOT NULL;

ALTER TABLE users ALTER COLUMN pass SET NOT NULL;

ALTER TABLE category ALTER COLUMN name SET NOT NULL;

-- delete

DROP TABLE users;

DROP TABLE category;

DROP TABLE recipe;

SELECT
    recipe.id,
    recipe.title,
    recipe.ingredients,
    recipe.photos,
    category.name AS category
FROM recipe
    JOIN category ON recipe.categoryid = category.id
WHERE
    ingredients ILIKE '%tepung%'
OFFSET 1
LIMIT 5;

SELECT COUNT(*)
FROM (
        SELECT recipe.id
        FROM recipe
            JOIN category ON recipe.categoryid = category.id
        WHERE
            ingredients ILIKE '%anggur%'
    ) AS subquery;

SELECT * FROM users WHERE email = 'hari@gmail.com' 

SELECT
    recipe.id,
    recipe.title,
    recipe.ingredients,
    recipe.img,
    category.name AS category,
    users.name AS author,
    users.photos AS author_photos,
    recipe.created_at
FROM recipe
    JOIN category ON recipe.category_id = category.id
    JOIN users ON recipe.users_id = users.id
ORDER BY recipe.id;

