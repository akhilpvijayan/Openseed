import express from 'express';
import cors from 'cors'; // Import the CORS package
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Import node-fetch for making HTTP requests

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Simple route to check server is up
app.get('/', (req, res) => {
    res.send('Server is up and running');
});

// Define your API route
app.post('/api/fetch-issues', async (req, res) => {
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
        console.error('Error fetching issues:', error);
        res.status(500).send('Error fetching issues');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
