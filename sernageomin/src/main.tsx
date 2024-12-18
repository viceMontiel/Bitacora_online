import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'


import AppHookContainer from './AppHookContainer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppHookContainer />
  </StrictMode>,
)
