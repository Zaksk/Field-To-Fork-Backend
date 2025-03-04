const { Router } = require('express');


const commentsController = require('../controllers/comments');
const authenticator = require("../middleware/authenticator");

const commentRouter = Router();

commentRouter.get('/:productid', authenticator, commentsController.index);
commentRouter.post('/', authenticator, commentsController.create);
commentRouter .delete('/:commentid',authenticator, commentsController.destroy);

module.exports = commentRouter;
