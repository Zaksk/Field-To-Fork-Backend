const Product = require('../models/Products');

async function index(req, res) {
    try {
      let user_id = req.body.login_id
      const products = await Product.getAllbyUserId(user_id);
      res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function show(req, res) {
  console.log(req.params.id)
    try {
      id = req.params.id
      const product = await Product.getOneById(id);
      res.status(200).json(product);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

async function create(req, res) {
    try{
        const data = req.body
        const newProduct = await Product.create(data)
        res.status(201).json(newProduct)
    } catch(err) {
        res.status(400).json({error: err.message})
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const data = req.body
        const product = await Product.getOneById(id)
        const result = await product.update(data)
        res.status(200).json(result);
    }
    catch(err) {
        res.status(404).json({error: err.message});
    }
  }

  async function destroy(req, res) {
    try {
      const id = req.params.id;
      const product = await Product.getOneById(id);
      const result = await product.destroy();
      res.status(204).end();
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async function filterByCategory(req, res) {
    try {
        const id = req.params.category_id;
        const category = await Product.filterByCategory(id)
        res.status(200).json(category);
    }
    catch(err) {
        res.status(404).json({error: err.message});
    }
  }

  async function addComment(req, res) {
    try{
        const data = req.body
        const newComment = await Product.addComment(data)
        res.status(201).json(newComment)
    } catch(err) {
        res.status(400).json({error: err.message})
    }
  }

  async function deleteComment(req, res) {
    try {
      const id = req.params.productid;
      const data = req.body
      console.log(data)
      const comment = await Product.getCommentsById(id);
      console.log(comment)
      // const commentid = comment[0].comment_id
      // const userid = comment[0].user_id
      const result = await comment.deleteComment(data);
      res.status(204).end();
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async function getCommentsById(req, res) {
      try {
        id = req.params.productid
        const comment = await Product.getCommentsById(id);
        res.status(200).json(comment);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
    }

    async function search(req, res) {}

module.exports = { index, show, create, update, destroy, filterByCategory, addComment, deleteComment, getCommentsById, search };
