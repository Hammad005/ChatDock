import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@/components/ui/theme-provider"
import { BrowserRouter } from 'react-router-dom'
import { ImageOverlayProvider } from './store/ImageOverlayContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ThemeProvider defaultTheme="dark" storageKey="ChatDock-theme">
    <ImageOverlayProvider>
    <App />
    </ImageOverlayProvider>
  </ThemeProvider>
  </BrowserRouter>
)
