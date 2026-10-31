import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, THEME_ID, createTheme } from '@mui/material/styles';

import './index.css'
import App from './App.tsx'

const theme = createTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={{ [THEME_ID]: theme }}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
