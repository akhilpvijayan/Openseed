# OpenSeed

OpenSeed is an open-source web application designed to help developers find "good first issues" on GitHub, making it easy to start contributing to open source projects.

<img width="956" alt="image" src="https://github.com/user-attachments/assets/05b28f62-77ad-49d3-bc53-bd8e12d805ca">

## Live Demo
Check out the live app: [OpenSeed](https://openseed.web.app/)

## Features
  - Discover Good First Issues: Find beginner-friendly GitHub issues to contribute to.
  - Filter by Programming Language: Narrow down issues by specific coding languages.
  - Category Browsing: Explore issues based on development areas like Web, Mobile, Machine Learning, etc.
  - Repository/Title Filter: Narrow down issues by specific repository names, labels or issue titles.
  - Bookmark for Later: Save issues in local storage for easy access later.
  - Dark/Light Mode Toggle: Switch between themes for comfortable browsing.
  - Multi language support

## Tech Stack
  - **Frontend**: Angular, Typescript, Material UI, HTML, CSS
  - **Backend**: Node.js
  - **API**: GitHub API for issue data
  - ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
 ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

## Getting Started
### Prerequisites
  - Node.js (v14 or later)
  - npm or yarn

## Installation
Clone the Repository:

```bash
git clone https://github.com/akhilpvijayan/openseed.git
```
Install Dependencies for both client and server:
Navigate to Project Directory:

```bash
cd openseed/openseed-server
```
```bash
npm install
```

```bash
cd openseed/openseed-client
```
```bash
npm install
```
Add GitHub API Url and Github Token:
Create a .env file in the root of openseed-server and add your GitHub API Url and Github Token:

```bash
GITHUB_TOKEN=your_github_token_here
GITHUB_API_URL=your_github_url_key_here
```
Change server url inside environment.ts file in openseed-client
Run the Development Server:

```bash
node server.js
```
```bash
ng serve
```
Open the App:
```Go to http://localhost:4200``` in your browser.

## Usage
  - Filter Issues: Use the sidebar to filter issues by language, category, license, owner,fork, stars, label or repository.
  - Bookmark Issues: Save interesting issues for future contributions.
  - Toggle Themes: Switch between light and dark modes using the toggle in the top right corner.
  - Languages: Switch between multiple languages using the toggle in the top left corner.

## Contributing
Contributions are welcome! Please follow these steps:

Fork the Repository
Create a New Branch:
```bash
git checkout -b feature/your-feature-name
```
Commit Your Changes:
```bash
git commit -m 'Add some feature'
```
Push to the Branch:
```bash
git push origin feature/your-feature-name
```
Open a Pull Request

## License
This project is licensed under the Apache-2.0 License - see the LICENSE file for details.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Acknowledgments
Special thanks to all the open-source projects and the GitHub API for making OpenSeed possible.
