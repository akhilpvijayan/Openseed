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
        'Cache-Control': 'no-cache, no-store, must-revalidate',  // Disable caching
    'Pragma': 'no-cache',
    'Expires': '0',
    };

    // Add a cache-busting timestamp
    const cacheBuster = `cacheBuster=${new Date().getTime()}`;
    const githubApiUrl = `${githubUrl}?${cacheBuster}`;

    try {
        console.log("Inside API");
        let data = null;
        const response = await fetch(githubApiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, variables }),
            cache: 'reload'
        });

        data = await response.json();

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

