const db = require('../database/connect');

class User {

    constructor({ login_id, username, password, name, surname, email}) {
        this.login_id = login_id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }

    static async getOneById(id) {
        const response = await db.query("SELECT login_id, username, name, surname, email FROM login_info WHERE login_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }



    static async getOneByUsername(username) {
        const response = await db.query("SELECT login_id, username, password FROM login_info WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { name, surname, username, password, email } = data;
        if(username == undefined || password == undefined) throw Error("Ensure username and password are both provided")
        let response = await db.query("INSERT INTO login_info (name, surname, username, password, email) VALUES ($1, $2, $3, $4, $5) RETURNING login_id;",
            [name, surname, username, password, email]);
        const newId = response.rows[0].login_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }




}

module.exports = User;