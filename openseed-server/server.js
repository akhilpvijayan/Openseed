import express from 'express';
import cors from 'cors';
import { fetchGitHubIssues } from './api/github.js';

const app = express();
const port = process.env.PORT || 3000;

// Allowed origins
const allowedOrigins = ['http://localhost:4200', 'https://openseed.vercel.app'];

// Use CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin, like mobile apps or curl requests
        if (!origin) return callback(null, true);

        // Allow only the specified origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
    },
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

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
