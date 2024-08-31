// api/github-fetch.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { method } = req;
  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { query, variables } = req.body;
  const githubToken = environment.GITHUB_TOKEN;

  if (!githubToken) {
    return res.status(500).json({ message: 'GitHub token is missing.' });
  }

  const githubApiUrl = 'https://api.github.com/graphql';

  try {
    const response = await fetch(githubApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from GitHub:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
