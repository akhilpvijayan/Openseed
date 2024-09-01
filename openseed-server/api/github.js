import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const githubUrl = 'https://api.github.com/graphql';
const githubToken = process.env.GITHUB_TOKEN;

if (!githubToken) {
    throw new Error("GITHUB_API_KEY is not set in environment variables");
}

// Function to fetch issues from GitHub
export const fetchGitHubIssues = async (query, variables) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`,
    };

    try {
        const response = await fetch(githubUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, variables })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error response from GitHub:', data);
            throw new Error(data.message || 'Failed to fetch issues from GitHub');
        }

        return data;
    } catch (error) {
        console.error("Error fetching GitHub issues:", error);
        throw error;
    }
};
