import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {DataProvider} from './context/DataContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentProvider } from './context/CurrentContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
    <DataProvider>
      <CurrentProvider>
      <App />
      </CurrentProvider>
      </DataProvider>
    </Router>
  </StrictMode>,
)
