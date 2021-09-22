const jwt = require('jsonwebtoken');

module.exports = function(request, response, next) {
  // Get the token from the header
  const token = request.header('auth-token');

  // verify if the token does not exists
  if(!token) {
    // Deny de access
    return response.status(401).send('Access denied');
  }

  try {
    // Set the user to a verified user
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    request.user = verified;

    return next();
  } catch (err) {
    response.status(400).send('Invalid token');
  }
}