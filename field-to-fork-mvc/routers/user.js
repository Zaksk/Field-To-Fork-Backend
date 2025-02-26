const { Router } = require('express');

const userController = require('../controllers/user.js');
const productController = require('../controllers/product.js');
const authenticator = require("../middleware/authenticator");

const userRouter = Router();
const productRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);


productRouter.get('/', authenticator, productController.getAll);
productRouter.get('/:id', authenticator, productController.getOneById);
productRouter.post('/', authenticator, productController.create);
productRouter.put('/:id', authenticator, productController.update);
productRouter.get('/category/:category_id', authenticator, productController.filterByCategory);

module.exports = { userRouter, productRouter}


