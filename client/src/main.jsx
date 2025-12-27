import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
        position="top-right" // top-right | top-center | bottom-left etc
        richColors
        // closeButton
        expand={true}
        toastOptions={{
          style: {
            fontSize: '14px',
            borderRadius: '0.75rem',
            padding: '12px 16px',
          },
          success: {
            style: {
              background: '#16a34a',
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#15803d',
            },
          },
          error: {
            style: {
              background: '#dc2626',
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#991b1b',
            },
          },
          info: {
            style: {
              background: '#2563eb',
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#1e40af',
            },
          },
          warning: {
            style: {
              background: '#f59e0b',
              color: 'black',
            },
            iconTheme: {
              primary: 'black',
              secondary: '#b45309',
            },
          },
        }}
      />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
