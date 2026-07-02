import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error('Root element not found')
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
