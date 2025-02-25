const db = require('../database/connect');

class User {

    constructor({ user_id, name, username, email, postcode, password, crated_at}) {
        this.user_id = user_id;
        this.name = name;
        this.password = password;
        this.crated_at = crated_at;
        this.postcode = postcode;
        this.email = email;
        this.username = username;
    }

    static async getOneById(id) {
        const response = await db.query("SELECT  user_id, name, email, postcode, password, crated_at FROM Users WHERE mary_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }



    static async getOneByUsername(username) {
        const response = await db.query("SELECT user_id, username, password FROM Users WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { name, surname, username, password, email } = data;
        if(username == undefined || password == undefined) throw Error("Ensure username and password are both provided")
        let response = await db.query("INSERT INTO Users ( user_id, name, email, postcode, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id;",
            [ user_id, name, email, postcode, password]);
        const newId = response.rows[0].login_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }




}

module.exports = User;