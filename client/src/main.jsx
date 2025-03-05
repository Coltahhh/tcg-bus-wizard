// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import global CSS
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

// Check if root element exists
if (!rootElement) {
    throw new Error('Root element not found! Check your index.html');
}

// Create React root
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Log successful initialization
console.log('Application initialized successfully!');