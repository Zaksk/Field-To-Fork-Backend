const db = require('../db/connect');
const { getDistance } = require("./distance.js");

class Product {
  constructor({
    product_id,
    user_id,
    type_id,
    variety,
    description,
    created_at,
    active,
    image_url,
    price,
  }) {
    this.product_id = product_id;
    this.user_id = user_id;
    this.type_id = type_id;
    this.variety = variety;
    this.description = description;
    this.created_at = created_at;
    this.active = active;
    this.image_url = image_url;
    this.price = price;
  }

  // Method to get all active products
  
  static async getAll() {
    let query = `
    SELECT p.*,
      c.category_id, c.category_name,
      t.type_id, t.type_name,
      pr.price_type_id, pr.price_type_name,
      u.postcode
    FROM 
      products as p
      INNER JOIN types AS t ON (t.type_id = p.type_id)
      INNER JOIN categories AS c ON (c.category_id = t.category_id)
      INNER JOIN price_types AS pr ON (pr.price_type_id = t.price_type_id)
      INNER JOIN users AS u ON (u.user_id = p.user_id)
    WHERE p.active = true
    ORDER BY p.created_at DESC
    `;
    const response = await db.query(query);
    if (response.rows.length === 0) {
      throw new Error('Products not found.')
    }
    return response.rows.map((el) => {
      return {
        product: new Product(el),
        category: el.category_name,
        type: el.type_name,
        postcode: el.postcode,
        price_type: el.price_type_name
        }
      })
  }


  
  // Method to display the product by it's id:

  static async getOneById(id) {
    const response = await db.query(
      "SELECT *, c.category_id, c.category_name, pr.price_type_id, pr.price_type_name FROM products as p INNER JOIN types as t ON (p.type_id = t.type_id) INNER JOIN categories as c ON (c.category_id = t.category_id) INNER JOIN price_types as pr ON (pr.price_type_id = t.price_type_id) WHERE p.product_id = $1",
      [id]
    );

    if (response.rows.length !== 1) {
      throw new Error("Product not found.");
    }
    return new Product(response.rows[0]);
  }

  
  // Method to create a product 

  static async create(data) {
    const { user_id, type_id, variety, description, active, image_url, price } =
      data;

    if (
      user_id === undefined ||
      type_id === undefined ||
      active === undefined
    ) {
      throw new Error(
        "Ensure the product type, user_id and active status are provided"
      );
    }

    let response = await db.query(
      "INSERT INTO products (user_id, type_id, variety, description, active, image_url, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [user_id, type_id, variety, description, active, image_url, price]
    );

    const newId = response.rows[0].product_id;
    const newProduct = await Product.getOneById(newId);
    return newProduct;
  }

  static async getAllbyUserId(user_id) {
    const response = await db.query(
      "SELECT *, c.category_id, c.category_name, pr.price_type_id, pr.price_type_name FROM products as p INNER JOIN types as t ON (p.type_id = t.type_id) INNER JOIN categories as c ON (c.category_id = t.category_id) INNER JOIN price_types as pr ON (pr.price_type_id = t.price_type_id) WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    return response.rows.map((el) => new Product(el));
  }


  // Method to update the product
  
  async update(data) {
    const { type_id, variety, description, active, image_url, price } = data;
    let response = await db.query(
      "UPDATE products SET type_id = $1, variety = $2, description = $3, active = $4, image_url = $5, price = $6 WHERE product_id = $7 RETURNING *",
      [type_id, variety, description, active, image_url, price, this.product_id]
    );
    if (response.rows.length !== 1) {
      throw new Error(
        `Update failed: Product ID ${this.product_id} not found.`
      );
    }
    return new Product(response.rows[0]);
  }

  
  // Destroy method to delete a product by id

  async destroy() {
    // Ensure the product exists before trying to delete it
    const response = await db.query(
      "DELETE FROM products WHERE product_id = $1 RETURNING *",
      [this.product_id] // Use this.product_id as it refers to the current product's ID
    );

    if (response.rows.length === 0) {
      throw new Error("Product not found.");
    }

    return "Product deleted successfully."; 
  }

  

  // Filter all product by the category (fruits, vegetables, plants and flowers),
  // ensure that only active products are returned
  static async filterByCategory(category_id) {
    const query = `
    SELECT *, 
    c.category_id, 
    c.category_name, 
    pr.price_type_id, 
    pr.price_type_name 
    FROM products as p 
    INNER JOIN types as t ON (p.type_id = t.type_id) 
    INNER JOIN categories as c ON (c.category_id = t.category_id) 
    INNER JOIN price_types as pr ON (pr.price_type_id = t.price_type_id) 
    WHERE c.category_id = $1
    AND p.active = true
    `;
    let response = await db.query(query, [category_id]);

    return response.rows.length ? response.rows : [];
  }

  // Searching by a string in the type name, variety and description among active products
  static async search(str) {
    if (!str) {
      throw new Error("Search string is required.");
    }

    const query = `
    SELECT t.type_name, 
           p.variety,
           p.description,
           p.product_id,
           p.type_id
    FROM products as p
    INNER JOIN types as t ON (t.type_id = p.type_id) 
    WHERE t.type_name ILIKE $1
       OR p.variety ILIKE $1
       OR p.description ILIKE $1
    AND p.active = true
  `;

    const searchString = `%${str}%`;
    const response = await db.query(query, [searchString]);
    return response.rows.map((el) => new Product(el));
  }

  // Get types gy category

  static async getTypesByCategory(id) {
    const query = `
    SELECT 
    t.type_id,
    t.type_name,
    t.price_type_id,
    pr.price_type_name FROM types AS t
    INNER JOIN categories AS c ON (c.category_id = t.category_id)
    INNER JOIN price_types AS pr ON (pr.price_type_id = t.price_type_id)
    WHERE c.category_id = $1
    `;
    
    const response = await db.query(query, [id]);
    return response.rows
  } 
}


module.exports = Product;