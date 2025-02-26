const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

async function register(req, res) {
  try {
    const data = req.body;
    
    // Generate a salt with a specific cost
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    
    // Hash the password
    data.password = await bcrypt.hash(data.password, salt);
    console.log(password, 'password hit')
    const result = await User.create(data);

    // Remove password before sending response
    const userResponse = {
      user_id: result.user_id,
      name: result.name,
      username: result.username,
      email: result.email,
      postcode: result.postcode,
      created_at: result.created_at,
    };

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.getOneByUsername(username);

    if (!user) {
      throw new Error("No user with this username");
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      if (!process.env.SECRET_TOKEN) {
        throw new Error("Missing JWT secret key.");
      }

      const payload = { user_id: user.user_id }; // Fixed: `user_id` instead of `login_id`

      jwt.sign(
        payload,
        process.env.SECRET_TOKEN,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            throw new Error("Error in token generation");
          }
          res.status(200).json({
            success: true,
            token: token,
          });
        }
      );
    } else {
      throw new Error("User could not be authenticated");
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function show(req, res) {
  try {
    let id = req.params.id;
    const user = await User.getUserById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = await User.getUserById(id);
    const result = await user.update(data);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function destroy(req, res) {
  try {
    const id = req.params.id;
    const user = await User.getUserById(id);
    const result = await user.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  register, login, show, update, destroy,
};
