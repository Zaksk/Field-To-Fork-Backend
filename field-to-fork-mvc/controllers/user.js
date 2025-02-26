const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require('../models/User');

async function register(req, res) {
    try {
      const data = req.body;
      console.log(data, "data hit")
  
      // Generate a salt with a specific cost
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
      data.password_hash = await bcrypt.hash(data.password_hash, salt);
      const result = await User.create(data);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
}
// Login controller
async function login(req, res) {
    const data = req.body;
    try {
      const user = await User.getOneByEmail(data.email);
      if (!user) {
        throw new Error('No user with this username');
      }

      const match = await bcrypt.compare(data.password, user.password);

      if (match) {
        const payload = { user_id: user.user_id }; 

        jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, (err, token) => {
          if (err) { throw new Error('Error in token generation'); }
          res.status(200).json({
              success: true,
              token: token,
          });
        });
      } else {
        throw new Error('User could not be authenticated');
      }
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
}

module.exports = {
  register, login
};