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
    description TEXT,
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
    comment_text TEXT,
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
('Winnie the Pooh', 'Winny', 'email@email.com', 'SG8 5HX', 'qwerty'),
('Alice Wonderland', 'Alice', 'alice@email.com', 'SG8 5RE', 'wonderland'),
('Bob Builder', 'Bob', 'bob@email.com', 'SG8 5NY', 'builder123'),
('Charlie Brown', 'Charlie', 'charlie@email.com', 'CB24 6AE', 'peanuts'),
('Dora Explorer', 'Dora', 'dora@email.com', 'CB23 5DT', 'explorer2025');


INSERT INTO products (user_id, type_id, variety, description, active, image_url, price) 
VALUES 
(1, 8, 'victoria', 'Freshly harvested Victoria plums, known for their sweet, juicy flavor and vibrant red-purple skin. Perfect for eating fresh, making jams, or baking. Grown locally with care, our surplus is available for a limited time—get yours while they last!', true, 'https://images.unsplash.com/photo-1569852118044-f57df8b4f0cf?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 3.50),
(3, 26, 'vine', 'Locally grown vine-ripened tomatoes, bursting with rich, sweet flavor and a juicy texture. Perfect for fresh salads, cooking, or making sauces. Picked at peak ripeness for the best taste—get them while they’re in season!', true, 'https://images.unsplash.com/photo-1513791053024-3b50799fdd7b?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1.15),
(2, 38, '13 cm', 'Vibrant and hardy cyclamen in a 13 cm pot, perfect for adding a splash of color to your home or garden. With delicate, upswept petals and lush green foliage, these beautiful flowers thrive in cool conditions and bloom for months. Ideal for gifting or brightening up any space!', true, 'https://images.unsplash.com/photo-1610816659999-611b2722d524?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1.45),
(1, 1, 'golden', 'Delicious and crisp golden apples, known for their sweet and slightly tart flavor. Perfect for fresh snacking, baking, or juicing. These sun-kissed apples have a smooth golden skin and a juicy, refreshing bite. A great choice for a healthy treat!', true, 'https://images.unsplash.com/photo-1603086175742-bc683b0d2716?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 2.99),
(2, 2, 'conference', 'Organic Conference pears, grown naturally without pesticides for a pure, fresh taste. These sweet and juicy pears have a smooth texture and signature elongated shape with greenish-bronze skin. Perfect for fresh eating, baking, or adding to salads. Enjoy their naturally honeyed flavor with confidence in their chemical-free cultivation!', true, 'https://plus.unsplash.com/premium_photo-1724697322743-60f00eccf63b?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 2.50),
(3, 3, 'autumn_raspberry', 'Organic Autumn raspberries, grown naturally without pesticides for a pure and delicious taste. These juicy, sweet-tart berries are bursting with flavor and perfect for fresh eating, desserts, or jams. Harvested at peak ripeness, they offer a vibrant color and soft texture, making them a delightful seasonal treat!', true, 'https://images.unsplash.com/photo-1626597825713-2cf6ad237229?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 3.20),
(1, 4, 'sequoia', 'Sequoia strawberries are known for their rich, sweet flavor and vibrant red color. These juicy, soft-textured berries are perfect for fresh eating, desserts, and homemade jams. Grown with care, they are hand-picked at peak ripeness to ensure the best taste and quality. Enjoy the fresh, farm-grown goodness of Sequoia strawberries.', true, 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 4.00),
(2, 12, 'Rainbow carrots', 'These vibrant Tri-Colored carrots are not only a feast for the eyes but also packed with rich flavors. Perfect for roasting, they bring a sweet, earthy taste that pairs wonderfully with your favorite dishes. Their natural color variations make them a great addition to salads and vegetable platters, while their crisp texture adds a satisfying crunch. Grown with care, our carrots are harvested at the perfect moment for optimal taste and nutrition. Add these colorful carrots to your kitchen for a healthy and flavorful experience!', true, 'https://images.unsplash.com/photo-1550411294-b3b1bd5fce1b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 2.10),
(3, 30, 'rocket', 'Fresh and peppery, our Rocket leaves add a bold, zesty flavor to any dish. Perfect for salads, sandwiches, or as a garnish, this leafy green is packed with vitamins and antioxidants. Grown with care, our Rocket is harvested at its peak freshness, ensuring a crisp texture and vibrant flavor.', true, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScbXe0xgs4oFl325Rawa88R9ZOYr3KKwbPfQ&s', 1.25)
RETURNING *;

INSERT INTO comments (user_id, product_id, comment_text) 
VALUES 
(2, 1, 'Can I take them tomorrow?'),
(1, 1, 'Absolutely');