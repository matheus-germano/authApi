const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();

dotenv.config();

// Connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  (err) => {
    if (err) throw err;
    console.log('🧾 Connected to db');
});

//Middlewares
app.use(express.json());

//Route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3333, () => {
  console.log('🚀 Server running on http://localhost:3333/');
});