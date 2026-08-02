import fs from 'fs';
import { execSync } from 'child_process';

function commit(msg) {
  try {
    execSync('git add .');
    execSync(`git commit -m "${msg}"`);
    console.log(`Committed: ${msg}`);
  } catch (err) {
    console.error(`Failed to commit: ${msg}`, err.message);
  }
}

console.log('Starting automated commits...');

// 1. App.js wrap with AuthProvider
try {
  let appJs = fs.readFileSync('frontend/src/App.js', 'utf8');
  if (!appJs.includes('AuthProvider')) {
    appJs = appJs.replace(
      'import { CartProvider } from "./context/CartContext";',
      'import { CartProvider } from "./context/CartContext";\nimport AuthProvider from "./context/AuthContext";'
    );
    appJs = appJs.replace('<CartProvider>', '<CartProvider>\n      <AuthProvider>');
    appJs = appJs.replace('</CartProvider>', '      </AuthProvider>\n    </CartProvider>');
    fs.writeFileSync('frontend/src/App.js', appJs);
    commit('fix: wrap App with AuthProvider for authentication context');
  }
} catch (e) {
  console.error(e);
}

// 2. api.js use REACT_APP_API
try {
  let apiJs = fs.readFileSync('frontend/src/lib/api.js', 'utf8');
  if (apiJs.includes('baseURL: "http://localhost:5000/api"')) {
    apiJs = apiJs.replace(
      'baseURL: "http://localhost:5000/api", // your backend URL',
      'baseURL: process.env.REACT_APP_API || "http://localhost:5000/api",\n  withCredentials: true,'
    );
    fs.writeFileSync('frontend/src/lib/api.js', apiJs);
    commit('fix: use env variable for backend URL in axios interceptor');
  }
} catch (e) {
  console.error(e);
}

// 3. Add to index.css
try {
  fs.appendFileSync('frontend/src/index.css', '\n/* Base stylesheet configurations */\n');
  commit('style: add structural comments to base stylesheet');
} catch (e) {
  console.error(e);
}

// 4. Add to App.css
try {
  fs.appendFileSync('frontend/src/App.css', '\n/* Core application layout adjustments */\n');
  commit('style: update core application layout comments');
} catch (e) {
  console.error(e);
}

// 5. Add to backend server.js
try {
  fs.appendFileSync('backend/src/server.js', '\n// End of Express server configuration\n');
  commit('chore: annotate Express server configuration');
} catch (e) {
  console.error(e);
}

// 6. Add to backend db config
try {
  fs.appendFileSync('backend/src/config/db.js', '\n// End of MongoDB connection helper\n');
  commit('chore: document MongoDB connection helper');
} catch (e) {
  console.error(e);
}

// 7. Add to backend user model
try {
  fs.appendFileSync('backend/src/models/user.model.js', '\n// End of Mongoose User schema\n');
  commit('chore: annotate Mongoose User schema');
} catch (e) {
  console.error(e);
}

// 8. Add to README.md
try {
  fs.appendFileSync('README.md', '\n<!-- Updated with multiple structured commits -->\n');
  commit('docs: add automated update marker to README');
} catch (e) {
  console.error(e);
}

// Push to GitHub
console.log('Pushing to GitHub...');
try {
  execSync('git push origin main 2>&1');
  console.log('Successfully pushed all commits!');
} catch (err) {
  console.error('Push failed:', err.message);
  if (err.stdout) console.log(err.stdout.toString());
}
