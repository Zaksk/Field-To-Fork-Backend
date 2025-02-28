const { Router } = require('express');


const productController = require('../controllers/products.js');
const authenticator = require("../middleware/authenticator");

const productRouter = Router();


productRouter.get('/', productController.index);
productRouter.get('/:id', productController.show);
productRouter.post('/', productController.create);
productRouter.patch('/:id', productController.update);
productRouter.delete('/:id', productController.destroy);
productRouter.get('/category/:category_id', productController.filterByCategory);
productRouter.get('/search', productController.search);
productRouter.get('/filter', productController.filter);

// productRouter.get('/comment/:productid', authenticator, productController.getCommentsById);
// productRouter.post('/comment', authenticator, productController.addComment);
// productRouter.delete('/comment/:productid/:commentid', authenticator, productController.deleteComment);

module.exports = productRouter
