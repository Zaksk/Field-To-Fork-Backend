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

  // async function deleteComment(req, res) {
  //   // console.log(req.params, 'sdfhsjdh')
  //   // console.log(req.body, 'sdfhsjdh')
  //   try {
  //     const id = req.params.productid;
  //     const userid = req.body.user_id
  //     const comment = await Product.getCommentsById(id);
  //     console.log(comment)
  //     const commentid = comment[0].comment_id
  //     const result = await comment.deleteComment({userid, commentid});
  //     res.status(204).end();
  //   } catch (err) {
  //     res.status(404).json({ error: err.message });
  //   }
  // }

//   async function deleteComment(req, res) {
//     try {
//         const productId = req.params.productid; // Extract product ID from URL
//         const userId = req.body.user_id; // Extract user_id from token
//         // Fetch comments for the given product
//         const comments = await Product.getCommentsById(productId);
//         console.log(comments)
//         if (comments.length === 0) {
//             return res.status(404).json({ error: "No comments found for this product." });
//         }
//         // Find the comment made by the authenticated user
//         console.log(userId, 'jsskdjkd')
//         const userComment = comments[0]
//         console.log(userComment.comment_id, 'userComment')
//         if (!userComment) {
//             return res.status(403).json({ error: "Unauthorized: No comment found for this user on this product." });
//         }
//         // Delete the comment
//         await Product.deleteComment({ user_id: userId, comment_id: userComment.comment_id });
//         res.status(200).json({ message: "Comment deleted successfully." });
//     } catch (err) {
//         res.status(500).json({ error: err.message }); 
//     }
//  }

async function deleteComment(req, res) {
  try {
      const productId = req.params.productid; // Extract product ID from URL
      const userId = req.body.user_id; // Extract user_id from token

      // Fetch comments for the given product
      const comments = await Product.getCommentsById(productId);
      console.log(comments, 'comment');
              if (comments.length === 0) {
          return res.status(404).json({ error: "No comments found for this product." });
      }
      // Find the comment made by the authenticated user
      const userComment = comments.filter(comment => comment.user_id === userId);
      console.log(userComment, "user's comments on the product");
      // const userComment = comments.find(comment => comment.comment_id === userId); // Find the comment from the user
      if (!userComment) {
          return res.status(403).json({ error: "Unauthorized: No comment found for this user on this product." });
        }
        res.status(200).json({ message: "Comment deleted successfully." });
      // Delete the comment
      await Product.deleteComment({ user_id: userId, comment_id: userComment.comment_id });
    }
   catch (err) {
      res.status(500).json({ error: err.message });
  }
}
  

  async function getCommentsById(req, res) {
      try {
        id = req.params.productid
        const comment = await Product.getCommentsById(id);
        console.log(comment)
        res.status(200).json(comment);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
    }

    async function search(req, res) {}

module.exports = { index, show, create, update, destroy, filterByCategory, addComment, deleteComment, getCommentsById, search };
