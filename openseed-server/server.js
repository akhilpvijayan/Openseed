import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fetchGitHubIssues } from './api/github.js';

const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Route for fetching issues
app.post('/api/fetch-issues', async (req, res) => {
    const { query, variables } = req.body;

    try {
        const data = await fetchGitHubIssues(query, variables);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at ${port}`);
});
