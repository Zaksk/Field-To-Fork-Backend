DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS price_types CASCADE;
DROP TABLE IF EXISTS types CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
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
    price_type_id INT,
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
    price DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (type_id) REFERENCES types (type_id)
);

CREATE TABLE comments (
    comment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment_text VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
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

-- Adding fruits
INSERT INTO types (category_id, price_type_id, type_name) VALUES
(1, 1, 'apples'),
(1, 1, 'pears'),
(1, 1, 'raspberries'),
(1, 1, 'strawberries'),
(1, 1, 'blackberries'),
(1, 1, 'currants'),
(1, 1, 'blueberries'),
(1, 1, 'plums'),
(1, 1, 'cherries'),
(1, 1, 'gooseberries');

-- Adding vegetables
INSERT INTO types (category_id, price_type_id, type_name) VALUES
(2, 1, 'spring_greens'),
(2, 1, 'carrots'),
(2, 2, 'cauliflower'),
(2, 1, 'celeriac'),
(2, 1, 'cucumbers'),
(2, 1, 'leeks'),
(2, 2, 'lettuce'),
(2, 1, 'onion'),
(2, 1, 'swede'),
(2, 1, 'turnip'),
(2, 1, 'parsnips'),
(2, 1, 'rhubarb'),
(2, 1, 'capsicum'),
(2, 1, 'chinese_leaf'),
(2, 1, 'celery'),
(2, 1, 'tomatoes'),
(2, 1, 'coriander'),
(2, 1, 'spinach_leaf'),
(2, 1, 'calabrese'),
(2, 1, 'rocket'),
(2, 1, 'mixed_babyleaf_salad'),
(2, 2, 'sweetcorn'),
(2, 1, 'beans'),
(2, 1, 'courgettes'),
(2, 1, 'peas'),
(2, 1, 'asparagus'),
(2, 1, 'watercress');

-- Adding the pot plants 
INSERT INTO types (category_id, price_type_id, type_name) VALUES
(3, 5, 'cyclamen'),
(3, 5, 'poinsettia'),
(3, 5, 'geranium');

-- Adding the cut flowers
INSERT INTO types (category_id, price_type_id, type_name) VALUES
(4, 3, 'tulips'),
(4, 3, 'gladioli'),
(4, 3, 'alstromeria'),
(4, 3, 'lillies'),
(4, 3, 'narcissus'),
(4, 3, 'chrysanthemum'),
(4, 3, 'stocks'),
(4, 3, 'sweet_williams'),
(4, 3, 'peony');


-- Adding some users, products and comments to play around, will be deleted later
INSERT INTO users (name, username, email, postcode, password_hash) 
VALUES 
('Winnie the Pooh', 'Winny', 'email@email.com', 'CB12khg', 'qwerty'),
('Alice Wonderland', 'Alice', 'alice@email.com', 'W1N 1AA', 'wonderland'),
('Bob Builder', 'Bob', 'bob@email.com', 'A23 4GH', 'builder123'),
('Charlie Brown', 'Charlie', 'charlie@email.com', 'P56R 7HH', 'peanuts'),
('Dora Explorer', 'Dora', 'dora@email.com', 'D9V 4JE', 'explorer2025');


INSERT INTO products (user_id, type_id, variety, description, active, image_url, price) 
VALUES 
(1, 8, 'victoria', 'awesome plums', true, 'image_url_plums', 3.50),
(3, 26, 'vine', 'freash vine tomatos', true, 'image_url_tomato', 1.15),
(2, 38, '13_cm', 'red cyclamen in a pot', true, 'image_url_cyclamen', 1.45),
(1, 1, 'golden_delicious', 'Fresh golden delicious apples', true, 'image_url_golden_delicious', 2.99),
(2, 2, 'conference', 'Conference pears, ripe and juicy', true, 'image_url_conference_pear', 2.50),
(3, 3, 'autumn_raspberry', 'Autumn raspberries, sweet and tart', true, 'image_url_autumn_raspberry', 3.20),
(1, 4, 'sequoia', 'Sequoia strawberries, sweet and juicy', true, 'image_url_sequoia_strawberry', 4.00),
(2, 12, 'baby_leeks', 'Fresh baby leeks', true, 'image_url_baby_leeks', 2.10),
(3, 13, 'crunchy_celery', 'Crunchy celery stalks, perfect for salads', true, 'image_url_crunchy_celery', 1.25)
RETURNING *;

INSERT INTO comments (user_id, product_id, comment_text) 
VALUES 
(2, 1, 'Can I take them tomorrow?'),
(1, 1, 'Absolutely');