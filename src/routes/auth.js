const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

// User register
router.post('/register', async (request, response) => {
  const { error } = registerValidation(request.body);

  if(error) {
    return response.status(400).send(error.details[0].message);
  }

  // Checking if the user is already in the database by the email
  const emailExists = await User.findOne({ email: request.body.email });

  if(emailExists) {
    return response.status(400).send('Email already exists.');
  }

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(request.body.password, salt);

  // Create new user
  const user = new User({
    name: request.body.name,
    email: request.body.email,
    password: hashedPassword,
  });

  // Save new user
  try {
    const savedUser = await user.save();
    response.status(200).send({ user: user._id });
  } catch (err) {
    response.status(400).send(err);
  }
});

// User login
router.post('/login', async (request, response) => {
  const { error } = loginValidation(request.body);

  if(error) {
    return response.status(400).send(error.details[0].message);
  }

  // Checking if the email exists
  const user = await User.findOne({ email: request.body.email });

  if(!user) {
    return response.status(400).send('Email or password is wrong.');
  }

  // Checking password
  const validPass = await bcrypt.compare(request.body.password, user.password);

  // If password is not correct
  if(!validPass) {
    return response.status(400).send('Invalid password');
  }

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  response.header('auth-token', token).send(token);
});

module.exports = router;