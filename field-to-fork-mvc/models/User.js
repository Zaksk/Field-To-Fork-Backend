const db = require("../db/connect");

class User {
  constructor({user_id, name, username, email, postcode, password_hash, created_at,
  }) {
    this.user_id = user_id;
    this.name = name;
    this.username = username;
    this.email = email;  
    this.postcode = postcode;
    this.password_hash = password_hash;
    this.created_at = created_at;
  }

  static async getOneById(id) {
    const response = await db.query("SELECT user_id, name, email, postcode, password_hash, created_at FROM users WHERE user_id = $1", [id]
    );

    if (response.rows.length !== 1) {
      throw new Error("Unable to locate user.");
    }
    return new User(response.rows[0]);
  }

  static async getOneByEmail(email) {
    const response = await db.query("SELECT user_id, name, email, postcode, password_hash FROM users WHERE email = $1", [email]
    );

    if (response.rows.length !== 1) {
      throw new Error("Unable to locate user.");
    }
    return new User(response.rows[0]);
  }

  static async create(data) {
    const { name, username, email, postcode, password_hash } = data;

    if (!email || !password_hash) 
    {
      throw new Error("Ensure email and password are both provided");
    }

    let response = await db.query("INSERT INTO users (name, username, email, postcode, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, username, email, postcode, created_at;", [name, username, email, postcode, password_hash]
    );

    return new User(response.rows[0]);
  }
}

module.exports = User;
