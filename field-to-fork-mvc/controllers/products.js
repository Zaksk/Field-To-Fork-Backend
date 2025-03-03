const Product = require('../models/Products');

async function showAll(req, res) {
  try {
    const products = await Product.getAll()
    res.status(200).json(products);
  }
  catch (err) {
    res.status(404).json({error: err.message})
  }
}

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
        const user_id = req.body.login_id;
        const product = await Product.getOneById(id)
        if (product.user_id !== user_id) {
          return res.status(403).json({
            error: "Unauthorized: You can only update your own product.",
          });
        }
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
      const user_id = req.body.login_id;
      const product = await Product.getOneById(id);
      if (product.user_id !== user_id) {
        return res
          .status(403)
          .json({
            error: "Unauthorized: You can only delete your own product.",
          });
      }
      const result = await product.destroy();
      res.status(200).json({ message: result });
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

  
module.exports = { showAll, index, show, create, update, destroy, filterByCategory };
