const { Router } = require('express');


const productController = require('../controllers/products.js');
const authenticator = require("../middleware/authenticator");

const productRouter = Router();


productRouter.get('/', authenticator, productController.index);
productRouter.get('/:id', authenticator, productController.show);
productRouter.post('/', authenticator, productController.create);
productRouter.patch('/:id', authenticator, productController.update);
productRouter.delete('/:id', authenticator, productController.destroy);
productRouter.get('/category/:category_id', authenticator, productController.filterByCategory);

// productRouter.get('/comment/:productid', authenticator, productController.getCommentsById);
// productRouter.post('/comment', authenticator, productController.addComment);
// productRouter.delete('/comment/:productid/:commentid', authenticator, productController.deleteComment);

module.exports = productRouter
