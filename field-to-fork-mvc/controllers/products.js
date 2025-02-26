const Product = require('../models/Products');

async function index(req, res) {
    try {
        let user_id = req.params.id
        const products = await Product.getAll(user_id);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function show(req, res) {
    try {
      id = req.params
      const product = await Product.getOneById(id);
      res.status(200).json(product);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

async function create(req, res) {
    try{
        const data = req.params  
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
      const product = await Product.getUserById(id);
      const result = await product.destroy();
      res.status(204).end();
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async function filterByCategory(req, res) {
    try {
        const id = req.params.id;
        const category = await Product.filterByCategory(id)
        res.status(200).json(category);
    }
    catch(err) {
        res.status(404).json({error: err.message});
    }
  }

module.exports = { index, show, create, update, destroy, filterByCategory };
