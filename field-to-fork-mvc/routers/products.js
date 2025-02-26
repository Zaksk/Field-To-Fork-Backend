const { Router } = require('express');


const productController = require('../controllers/product.js');
const authenticator = require("../middleware/authenticator");

const productRouter = Router();


productRouter.get('/', authenticator, productController.getAll);
productRouter.get('/:id', authenticator, productController.getOneById);
productRouter.post('/', authenticator, productController.create);
productRouter.put('/:id', authenticator, productController.update);
productRouter.get('/category/:category_id', authenticator, productController.filterByCategory);


module.exports = productRouter