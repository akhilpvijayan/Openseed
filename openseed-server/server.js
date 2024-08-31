// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Import the API routes
const githubRoute = require('./api/github');
app.use('/api/github', githubRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
