#OpenSeed
OpenSeed is an open-source web application designed to help developers find "good first issues" on GitHub, making it easy to start contributing to open source projects.
<img width="956" alt="image" src="https://github.com/user-attachments/assets/05b28f62-77ad-49d3-bc53-bd8e12d805ca">

Live Demo
Check out the live app: [OpenSeed](https://openseed.vercel.app/)

#Features
Discover Good First Issues: Find beginner-friendly GitHub issues to contribute to.
Filter by Programming Language: Narrow down issues by specific coding languages.
Category Browsing: Explore issues based on development areas like Web, Mobile, Machine Learning, etc.
Repository/Title Filter: Narrow down issues by specific repository names, labels or issue titles.
Bookmark for Later: Save issues in local storage for easy access later.
Dark/Light Mode Toggle: Switch between themes for comfortable browsing.
Multi language support

#Tech Stack
Frontend: Angular, Typescript, Material UI, HTML, CSS
Baackend: Node.js
API: GitHub API for issue data

#Getting Started
Prerequisites
Node.js (v14 or later)
npm or yarn

Installation
Clone the Repository:

bash
Copy code
git clone https://github.com/akhilpvijayan/openseed.git

Navigate to Project Directory:

bash
Copy code
cd openseed

Install Dependencies for both client and server:

bash
Copy code
cd openseed-server/npm install

bash
Copy code
cd openseed-client/npm install

Add GitHub API Key:
Create a .env file in the root of openseed-server and add your GitHub API key:

bash
Copy code
GITHUB_API_KEY=your_github_api_key_here

Run the Development Server:

bash
Copy code
node server.js

bash
Copy code
ng serve

Open the App:
Go to http://localhost:4200 in your browser.

#Usage
Filter Issues: Use the sidebar to filter issues by language, category, license, owner,fork, stars, label or repository.
Bookmark Issues: Save interesting issues for future contributions.
Toggle Themes: Switch between light and dark modes using the toggle in the top right corner.
Languages: Switch between multiple languages using the toggle in the top left corner.

#Contributing
Contributions are welcome! Please follow these steps:

Fork the Repository
Create a New Branch:
bash
Copy code
git checkout -b feature/your-feature-name
Commit Your Changes:
bash
Copy code
git commit -m 'Add some feature'
Push to the Branch:
bash
Copy code
git push origin feature/your-feature-name
Open a Pull Request
For more details, check the Contributing Guidelines.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Special thanks to all the open-source projects and the GitHub API for making OpenSeed possible.
