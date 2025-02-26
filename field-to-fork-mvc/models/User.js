const db = require('../db/connect'); // Updated to match your 'db' folder

class User {
    constructor({ user_id, name, username, email, postcode, password, created_at }) {
        this.user_id = user_id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.postcode = postcode;
        this.password = password;
        this.created_at = created_at; // Fixed typo from 'crated_at'
    }

    static async getOneById(id) {
        const response = await db.query(
            "SELECT user_id, name, username, email, postcode, password, created_at FROM Users WHERE user_id = $1",
            [id]
        );
        if (response.rows.length !== 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneByUsername(username) {
        const response = await db.query(
            "SELECT user_id, username, password FROM Users WHERE username = $1",
            [username]
        );
        if (response.rows.length !== 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { name, username, email, postcode, password } = data;

        if (!username || !password) {
            throw new Error("Ensure username and password are both provided");
        }

        const response = await db.query(
            "INSERT INTO Users (name, username, email, postcode, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id;",
            [name, username, email, postcode, password]
        );

        const newId = response.rows[0].user_id;
        return await User.getOneById(newId);
    }
}

module.exports = User;