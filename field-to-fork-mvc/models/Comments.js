const db = require('../db/connect');

class Comment {
    constructor({ comment_id, user_id, product_id, created_at, comment_text }) {
        this.comment_id = comment_id;
        this.user_id = user_id;
        this.product_id = product_id;
        this.created_at = created_at;
        this.comment_text = comment_text;
    }

    static async getOneById(comment_id) {
        const response = await db.query("SELECT * FROM comments WHERE comment_id = $1", [comment_id]);
        if (response.rows.length !== 1) {
            throw new Error("Comment not found.");
        }
        return new Comment(response.rows[0]);
    }


    static async getAllByProductId(product_id) {
        const query = `
        SELECT c.comment_id, c.user_id, u.username, c.product_id, c.created_at, c.comment_text 
         FROM comments c
         JOIN users u ON c.user_id = u.user_id
         WHERE c.product_id = $1 
         ORDER BY c.created_at DESC
        `;
        const response = await db.query(query, [product_id]);
        return response.rows.map((el) => {
          return {
            comment: new Comment(el),
            user_name: el.username,
          };
        });
    }

    static async create(data) {
        const { user_id, product_id, comment_text } = data;
        if (!user_id || !product_id || !comment_text.trim()) {
            throw new Error("Ensure user_id, product_id, and comment_text are provided.");
        }
        const response = await db.query(
            "INSERT INTO comments (user_id, product_id, comment_text) VALUES ($1, $2, $3) RETURNING *",
            [user_id, product_id, comment_text]
        );
        if (response.rows.length !== 1) {
            throw new Error("Could not add a comment.");
        }
        return new Comment(response.rows[0]);
    }

    async destroy() {
        const response = await db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [this.comment_id]);
        if (response.rows.length !== 1) {
            throw new Error("Could not delete the comment.");
        }
        return { message: "Comment deleted successfully." };
    }
}

module.exports = Comment;
