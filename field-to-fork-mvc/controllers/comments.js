const Comment = require('../models/Comments');

async function index(req, res) {
    try {
        let product_id = req.params.productid;
        const comments = await Comment.getAllByProductId(product_id);
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function create(req, res) {
    try {
        const data = req.body;
        const user_id = req.body.login_id; 
        if (!data.product_id || !data.comment_text || !user_id) {
            return res.status(400).json({ error: "Ensure user_id, product_id, and comment_text are provided." });
        }
        const newComment = await Comment.create({
            user_id: user_id,  
            product_id: data.product_id,
            comment_text: data.comment_text
        });
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function destroy(req, res) {
    try {
        const comment_id = req.params.commentid;
        const user_id = req.body.login_id;
        const comment = await Comment.getOneById(comment_id);
        if (comment.user_id !== user_id) {
            return res.status(403).json({ error: "Unauthorized: You can only delete your own comments." });
        }
        await comment.destroy();
        res.status(204).end();
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}


module.exports = { index, create, destroy };
