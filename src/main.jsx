import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Expose the pure modules for automated verification.
import * as curriculum from './lib/curriculum.js'
import * as storelib from './lib/store.js'
import * as onboarding from './lib/onboarding.js'
import * as analysis from './lib/analysis.js'

window.__clarity = { curriculum, store: storelib, onboarding, analysis }

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
