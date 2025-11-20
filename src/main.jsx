import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/gps/:id" element={<App />} />
        <Route path="/" element={<Navigate to="/gps/default" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
