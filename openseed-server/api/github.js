// api/github.js
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/fetch-issues', async (req, res) => {
  const { query, variables } = req.body;

  try {
    const response = await fetch(process.env.GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from GitHub:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
