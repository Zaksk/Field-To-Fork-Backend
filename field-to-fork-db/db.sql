DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS price_types;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS comments;

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    postcode VARCHAR(50) NOT NULL,
    password_hash VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE price_types (
    price_type_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    price_type_name VARCHAR(50) NOT NULL
);

CREATE TABLE types (
    type_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id INT,
    price_type_id DECIMAL(10,2),
    type_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (category_id),
    FOREIGN KEY (price_type_id) REFERENCES price_types (price_type_id)
);

CREATE TABLE products (
    product_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    type_id INT NOT NULL,
    variety VARCHAR(50),
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL,
    image_url VARCHAR(200),
    price INT,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (type_id) REFERENCES types (type_id)
);

INSERT INTO price_types (price_type_name)
VALUES 
('kg'),
('head'),
('stem'),
('twin'),
('unit');

INSERT INTO categories (category_name)
VALUES 
('fruit'),
('vegetable'),
('pot plants'),
('cut flowers'),
('other');

