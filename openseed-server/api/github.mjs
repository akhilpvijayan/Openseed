import express from 'express';
import fetch from 'node-fetch';

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

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching GitHub issues:', error);
    res.status(500).send('Error fetching GitHub issues');
  }
});

export default router;
