# News Summarizer & Fake News Detector — Frontend

This is the React frontend for the News Summarizer & Fake News Detector platform. Instantly summarize news articles and check their credibility with AI.

🌟 Project Overview
Paste a news link or article text
Get AI-powered summaries & credibility checks
User-friendly, fast, and mobile-responsive UI
Admin dashboard for analytics & user feedback
Works seamlessly with our Django backend API

✨ Features
Summarize by URL or pasted text
Detect likely fake news (AI-powered)
View history of recent queries
Admin-only analytics, feedback, and logs
Secure admin authentication

🛠️ Getting Started
1. Clone the Repo
git clone https://github.com/Griffins2005/News-Summarizer.git
cd News-Summarizer
2. Install Dependencies
bash
Copy
Edit
npm install
3. Run in Development
bash
Copy
Edit
npm start
Visit: http://localhost:3000

🏗️ Build for Production
bash
Copy
Edit
npm run build
The optimized static site will be in the /build directory.

🚀 Deployment
Static Hosting (Render, Netlify, Vercel, etc):

Set build command:

bash
Copy
Edit
npm install && npm run build && cp public/static.json build/
Set publish directory to:

nginx
Copy
Edit
build
[Optional] Add a public/static.json for SPA routing on Render.

🔐 Admin Dashboard
Go to /admin for login (uses Django superuser credentials)

Requires backend running and accessible

Access analytics at /admin/analytics, feedback at /admin/feedback, history at /admin/history

⚡ Backend API
The backend must be running!
See setup guide:
https://github.com/Griffins2005/News-Summarizer-Backend

📝 License
MIT

Built by Griffins Kiptanui Lelgut

yaml
Copy
Edit


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about running tests for more information.

### `npm run build`

Builds the app for production to the build folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about deployment for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you eject, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# News-Summarizer
>>>>>>> 18a31c275fbfc826293c1ba5e38416650bc71858.
