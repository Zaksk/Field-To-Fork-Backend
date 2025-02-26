const db = require('../db/connect');

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

  // To display on the product card all product details including:
  //  - everything from the products table
  //  - price type and price type id
  // - category name and category id from the categories table
  // - type name and type id
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

  static async addComment(data) {
    const { user_id, product_id, comment_text } = data;

    if (!user_id || !product_id) {
      throw new Error("Ensure the user_id and product_id are provided.");
    }
    if (!comment_text || comment_text.trim() === "") {
      throw new Error("The text of the comment is required.");
    }

    let response = await db.query(
      "INSERT INTO COMMENTS (user_id, product_id, comment_text) VALUES ($1, $2, $3) RETURNING *",
      [user_id, product_id, comment_text]
    );

    if (response.rows.length !== 1) {
      throw new Error("Could not add a comment.");
    }
    return response.rows[0];
  }

  async deleteComment(data) {
    const { user_id, comment_id } = data;

    if (!user_id || !comment_id) {
      throw new Error("Ensure user_id and comment_id are provided.");
    }

    // Check if the comment exists and if the user_id matches
    const commentCheck = await db.query(
      "SELECT user_id FROM comments WHERE comment_id = $1",
      [comment_id]
    );

    if (commentCheck.rows.length === 0) {
      throw new Error("Comment not found.");
    }

    if (commentCheck.rows[0].user_id !== user_id) {
      throw new Error("Unauthorised: You can only delete your own comments.");
    }

    const response = await db.query(
      "DELETE FROM comments WHERE comment_id = $1 RETURNING *",
      [comment_id]
    );

    if (response.rows.length !== 1) {
      throw new Error("Could not delete the comment.");
    }

    return { message: "Comment deleted successfully." };
  }

  // Displaying all comments for the product ordered by the timestamp from newest to oldest
  static async getCommentsById(product_id) {
    if (!product_id) {
      throw new Error("Ensure product_id is provided.");
    }

    let response = await db.query(
      "SELECT com.comment_text, u.name, com.created_at FROM comments as com INNER JOIN users as u ON (u.user_id = com.user_id) WHERE com.product_id = $1 ORDER BY com.created_at DESC",
      [product_id]
    );

    return response.rows;
  }

  // Filter all product by the category (fruits, vegetables, plants and flowers)
  static async filterByCategory(category_id) {
    let response = await db.query(
      "SELECT *, c.category_id, c.category_name, pr.price_type_id, pr.price_type_name FROM products as p INNER JOIN types as t ON (p.type_id = t.type_id) INNER JOIN categories as c ON (c.category_id = t.category_id) INNER JOIN price_types as pr ON (pr.price_type_id = t.price_type_id) WHERE c.category_id = $1",
      [category_id]
    );
    return response.rows.length ? response.rows : [];
  }

  // Searching by a string in the type name, variety and description
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
  `;

    const searchString = `%${str}%`;
    const response = await db.query(query, [searchString]);
    return response.rows;
  }
  /* TO DO
  // Filter the products by specifying category, type, location(?!), variety and description.
  Order by the most recently added (?) 
  static async filter(data) {
  }
  */
}
module.exports = Product;