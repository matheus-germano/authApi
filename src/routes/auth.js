const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');

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

  // Create new user
  const user = new User({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
  });

  // Save new user
  try {
    const savedUser = await user.save();
    response.status(200).send(savedUser);
  } catch (err) {
    response.status(400).send(err);
  }
});

module.exports = router;