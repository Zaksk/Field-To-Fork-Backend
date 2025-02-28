const { Router } = require('express');


const commentsController = require('../controllers/comments');
const authenticator = require("../middleware/authenticator");

const commentRouter = Router();

commentRouter.get('/:productid', commentsController.index);
commentRouter.post('/', commentsController.create);
commentRouter .delete('/:commentid', commentsController.destroy);

module.exports = commentRouter;
